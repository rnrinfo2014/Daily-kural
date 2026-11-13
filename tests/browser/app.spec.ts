import { test, expect, type Page } from '@playwright/test';
const key = 'nitham_oru_kural_v2_habit_state';
async function seed(page: Page, overrides: Record<string, unknown> = {}) {
  await page.addInitScript(({ key, overrides }) => localStorage.setItem(key, JSON.stringify({ language: 'english', onboardingCompleted: true, reminderEnabled: false, advancedMode: true, ...overrides })), { key, overrides });
}

test('completion is specific to the day, even for previously read Kurals', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-11-12T12:00:00') });
  await seed(page, { completedNumbers: [1], completedDates: ['2026-11-11'], customDailyKuralNumber: 1, customDailyDate: '2026-11-12' });
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Read & Complete Today', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Read & Complete Today', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Today’s Habit Completed', exact: true })).toBeVisible();
  const state = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)!), key);
  expect(state.completedDates).toEqual(['2026-11-11', '2026-11-12']);
});

test('an open app refreshes the Kural at midnight and records the new date', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-11-12T23:59:55') });
  await seed(page, { scheduleTime: '00:00', customDailyKuralNumber: 2, customDailyDate: '2026-11-12' });
  await page.goto('/');
  await page.clock.runFor(20000);
  await page.getByRole('button', { name: 'Read & Complete Today', exact: true }).click();
  const state = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)!), key);
  expect(state.completedDates).toEqual(['2026-11-13']);
  expect(state.completedNumbers).not.toContain(2);
});

test('malformed stored preferences do not crash the app', async ({ page }) => {
  await seed(page, { language: 'invalid', selectedTopics: [null], personalNotes: { 1: 23 }, scheduleTime: 'bad', favoriteNumbers: [null, -1, 'x'] });
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('main')).toBeVisible();
  expect(errors).toEqual([]);
});

test('PWA supports an offline reload after its first cache completes', async ({ page, context }) => {
  await seed(page);
  await page.goto('/');
  await page.evaluate(() => navigator.serviceWorker.ready.then(() => true));
  await page.reload();
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null);
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('button', { name: 'Read & Complete Today', exact: true })).toBeVisible();
});

test('mobile navigation, search, notes and sharing render without errors', async ({ page }) => {
  await seed(page);
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await page.locator('textarea').fill('Today I will practice patience.');
  await expect.poll(() => page.evaluate((key) => Object.values(JSON.parse(localStorage.getItem(key)!).personalNotes).includes('Today I will practice patience.'), key)).toBe(true);
  await page.getByRole('navigation', { name: 'Mobile navigation' }).getByRole('button', { name: '1330 Directory' }).click();
  await expect(page.getByPlaceholder(/search/i)).toBeVisible();
  await page.getByPlaceholder(/search/i).fill('1330');
  await expect(page.getByRole('main')).toContainText('1330');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(errors).toEqual([]);
});

test('a completed previous cycle becomes incomplete at the morning schedule', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-11-12T06:59:55') });
  await seed(page, { scheduleTime: '07:00', completedDates: ['2026-11-11'], completedNumbers: [2], customDailyKuralNumber: 2, customDailyDate: '2026-11-11' });
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Today’s Habit Completed', exact: true })).toBeVisible();
  await page.clock.runFor(20000);
  await expect(page.getByRole('button', { name: 'Read & Complete Today', exact: true })).toBeVisible();
});

test('share studio exports a PNG poster', async ({ page }) => {
  await seed(page);
  await page.goto('/');
  await page.getByRole('button', { name: 'Share Kural', exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Poster PNG', exact: true }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^daily-kural-\d+\.png$/);
  expect(await download.failure()).toBeNull();
});
