export function parseSchedule(value: string): [number, number] {
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) return [7, 0];
  return value.split(':').map(Number) as [number, number];
}

export function localDate(now: Date): string {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

export function getEffectiveCycleDate(scheduleTime: string, now = new Date()): string {
  const [hour, minute] = parseSchedule(scheduleTime);
  const date = new Date(now);
  if (now.getHours() * 60 + now.getMinutes() < hour * 60 + minute) date.setDate(date.getDate() - 1);
  return localDate(date);
}

export function currentStreak(dates: string[], today: string): number {
  const completed = new Set(dates);
  const date = new Date(`${today}T12:00:00`);
  if (!completed.has(localDate(date))) date.setDate(date.getDate() - 1);
  let count = 0;
  while (completed.has(localDate(date))) {
    count++;
    date.setDate(date.getDate() - 1);
  }
  return count;
}
