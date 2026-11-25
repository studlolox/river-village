import { describe, test, expect } from 'vitest';
import { Villager } from '../js/sim/villager.js';

describe('SPEC-FV-092', () => {
  test('FV-092 gifts raise hearts to a max of 10', () => {
    const v = new Villager('Maren Reed');
    for (let i = 0; i < 20; i++) v.giveGift(v.loves[0]);
    expect(v.friendship).toBe(10);
  });
});
