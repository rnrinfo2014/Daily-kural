import { test } from 'node:test';
import assert from 'node:assert/strict';
import { currentStreak, getEffectiveCycleDate, parseSchedule } from '../src/lib/habit';

test('midnight is a valid reminder time', () => {
  assert.deepEqual(parseSchedule('00:30'), [0, 30]);
  assert.equal(getEffectiveCycleDate('00:30', new Date('2026-11-12T00:29:00')), '2026-11-11');
  assert.equal(getEffectiveCycleDate('00:30', new Date('2026-11-12T00:30:00')), '2026-11-12');
});
test('daily cycle changes at schedule across year boundary', () => {
  assert.equal(getEffectiveCycleDate('07:00', new Date('2027-01-01T06:59:00')), '2026-12-31');
  assert.equal(getEffectiveCycleDate('07:00', new Date('2027-01-01T07:00:00')), '2027-01-01');
});
test('invalid schedules fall back to seven AM', () => {
  for (const value of ['', '25:00', '12:99', 'broken']) assert.deepEqual(parseSchedule(value), [7, 0]);
});
test('streak counts consecutive dates and permits unfinished today', () => {
  assert.equal(currentStreak(['2026-11-09', '2026-11-11', '2026-11-12'], '2026-11-12'), 2);
  assert.equal(currentStreak(['2026-11-10', '2026-11-11'], '2026-11-12'), 2);
  assert.equal(currentStreak(['2026-11-09'], '2026-11-12'), 0);
  assert.equal(currentStreak(['2026-11-12', '2026-11-12'], '2026-11-12'), 1);
});
