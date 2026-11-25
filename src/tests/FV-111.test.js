import { describe, test, expect } from 'vitest';
import { EggHuntContest } from '../js/sim/festival-games.js';

describe('SPEC-FV-111', () => {
  test('FV-111 festival contest scoring is original', () => {
    const c = new EggHuntContest();
    c.collectItem('egg');
    expect(c.score).toBe(1);
    expect(c.name).toBe('Egg Hunt');
  });
});
