import { describe, test, expect } from 'vitest';
import { Mine } from '../js/sim/mine.js';
import { Puddle } from '../js/sim/monster.js';

describe('SPEC-FV-053', () => {
  test('FV-053 sword attack kills a monster and drops loot', () => {
    const mine = new Mine();
    const m = new Puddle({ x: 2, y: 2 });
    mine.player.attack(mine, m);
    expect(m.hp).toBeLessThan(m.maxHp);
    while (m.hp > 0) mine.player.attack(mine, m);
    expect(m.dead).toBe(true);
  });
});
