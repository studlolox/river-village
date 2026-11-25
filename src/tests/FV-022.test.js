import { describe, test, expect } from 'vitest';
import { TimeOfDay, ReedsMarket } from '../js/sim/time.js';

describe('SPEC-FV-022', () => {
  test('FV-022 shops open by time-of-day', () => {
    const t = new TimeOfDay();
    t.setMinutes(9 * 60);
    expect(ReedsMarket.isOpen(t)).toBe(true);
    t.setMinutes(22 * 60);
    expect(ReedsMarket.isOpen(t)).toBe(false);
  });
});
