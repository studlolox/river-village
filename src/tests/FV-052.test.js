import { describe, test, expect } from 'vitest';
import { Mine } from '../js/sim/mine.js';
import { Puddle } from '../js/sim/monster.js';

describe('SPEC-FV-052', () => {
  test('FV-052 monster contact damages player', () => {
    const mine = new Mine();
    const p = mine.player;
    const hp = p.hp;
    mine.addMonster(new Puddle({ x: 2, y: 2 }));
    p.gridPos = { x: 2, y: 2 };
    mine.updateContacts();
    expect(p.hp).toBeLessThan(hp);
  });
});
