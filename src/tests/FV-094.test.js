import { describe, test, expect } from 'vitest';
import { Villager, Pendant } from '../js/sim/villager.js';

describe('SPEC-FV-094', () => {
  test('FV-094 proposal at 10 hearts moves spouse to holding', () => {
    const v = new Villager('Maren Reed');
    v.friendship = 10;
    const ok = v.propose(new Pendant());
    expect(ok).toBe(true);
    expect(v.location).toBe('Honeysuckle Holding');
  });
});
