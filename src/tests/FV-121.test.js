import { describe, test, expect } from 'vitest';
import { Puddle } from '../js/sim/monster.js';

describe('SPEC-FV-121', () => {
  test('FV-121 killed monster drops original loot', () => {
    const m = new Puddle({ x: 0, y: 0 });
    const loot = m.onDeath();
    expect(loot.some((i) => i.kind === 'Slime')).toBe(true);
  });
});
