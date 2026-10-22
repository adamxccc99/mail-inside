import test from 'node:test';
import assert from 'node:assert/strict';
import { formatCountdown, getRemainingSeconds, DURATION_OPTIONS, formatBytes } from './time.ts';

test('DURATION_OPTIONS has 9 options ranging from 1h to 168h', () => {
  assert.equal(DURATION_OPTIONS.length, 9);
  assert.equal(DURATION_OPTIONS[0].hours, 1);
  assert.equal(DURATION_OPTIONS[DURATION_OPTIONS.length - 1].hours, 168);
});

test('getRemainingSeconds calculates remaining time safely', () => {
  const now = 1000000000;
  const expiresAt = now + 3600 * 1000; // 1 hour
  assert.equal(getRemainingSeconds(expiresAt, now), 3600);

  // Past expiration returns 0, never negative
  assert.equal(getRemainingSeconds(now - 500, now), 0);
});

test('formatCountdown formats HH:MM:SS and day strings accurately', () => {
  // 1 hour, 2 minutes, 3 seconds = 3723s
  const res1 = formatCountdown(3723);
  assert.equal(res1.hours, 1);
  assert.equal(res1.minutes, 2);
  assert.equal(res1.seconds, 3);
  assert.equal(res1.displayString, '01:02:03');
  assert.equal(res1.isExpiringSoon, false);

  // 2 days, 3 hours, 4 minutes, 5 seconds = 2*86400 + 3*3600 + 4*60 + 5 = 183845
  const res2 = formatCountdown(183845);
  assert.equal(res2.days, 2);
  assert.equal(res2.hours, 3);
  assert.equal(res2.displayString, '2d 03:04:05');

  // Expiring soon: 5 minutes = 300s
  const res3 = formatCountdown(300);
  assert.equal(res3.isExpiringSoon, true);
});

test('formatBytes formats file sizes appropriately', () => {
  assert.equal(formatBytes(0), '0 B');
  assert.equal(formatBytes(1024), '1 KB');
  assert.equal(formatBytes(1048576), '1 MB');
});
