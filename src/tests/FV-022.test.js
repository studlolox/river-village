import { describe, test, expect } from 'vitest';
import { TimeOfDay, ReedsMarketHours } from '../js/sim/time.js';

describe('SPEC-FV-022 Day/night cycle', () => {
  test('FV-022 shops open by time-of-day', () => {
    const t = new TimeOfDay();
    t.setMinutes(9 * 60);
    expect(ReedsMarketHours.isOpen(t)).toBe(true);
    t.setMinutes(22 * 60);
    expect(ReedsMarketHours.isOpen(t)).toBe(false);
  });
});
