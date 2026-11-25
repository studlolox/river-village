import { describe, test, expect } from 'vitest';
import { MonsterRoster } from '../js/sim/monster.js';

describe('SPEC-FV-120', () => {
  test('FV-120 monsters use original names', () => {
    const roster = MonsterRoster.all();
    roster.forEach((m) => {
      expect(['stardew', 'slime', 'skeleton', 'dwarf', 'ghost'].some((s) => m.kind.toLowerCase().includes(s))).toBe(false);
    });
  });
});
