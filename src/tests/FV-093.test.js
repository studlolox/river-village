import { describe, test, expect } from 'vitest';
import { Villager } from '../js/sim/villager.js';

describe('SPEC-FV-093', () => {
  test('FV-093 gift reaction matches villager tastes', () => {
    const v = new Villager('Maren Reed');
    expect(v.reactionTo('WildBerry')).toBe('love');
    expect(v.reactionTo('Stone')).toBe('dislike');
  });
});
