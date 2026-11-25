import { describe, test, expect } from 'vitest';
import { Villager } from '../js/sim/villager.js';

describe('SPEC-FV-090', () => {
  test('FV-090 villagers follow their schedule', () => {
    const v = new Villager('Maren Reed');
    v.setSchedule({ time: 9 * 60, location: 'ReedsMarket' });
    expect(v.locationAt(9 * 60)).toBe('ReedsMarket');
  });
});
