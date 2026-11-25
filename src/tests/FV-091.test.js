import { describe, test, expect } from 'vitest';
import { Villager } from '../js/sim/villager.js';

describe('SPEC-FV-091', () => {
  test('FV-091 dialogue varies by friendship', () => {
    const v = new Villager('Maren Reed');
    v.friendship = 8;
    expect(v.talk()).toContain('friend');
    v.friendship = 0;
    expect(v.talk()).not.toContain('friend');
  });
});
