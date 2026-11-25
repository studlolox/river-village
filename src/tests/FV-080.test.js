import { describe, test, expect } from 'vitest';
import { Blacksmith } from '../js/sim/blacksmith.js';
import { Player } from '../js/sim/player.js';

describe('SPEC-FV-080', () => {
  test('FV-080 tool upgrade improves the tool', () => {
    const b = new Blacksmith();
    const p = new Player({ gold: 500, inventory: { CopperOre: 5 } });
    b.upgradeTool(p, 'wateringCan');
    expect(p.tool('wateringCan').tier).toBe(2);
  });
});
