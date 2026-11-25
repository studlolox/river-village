import { describe, test, expect } from 'vitest';
import { Mine } from '../js/sim/mine.js';
import { Inventory } from '../js/sim/inventory.js';

describe('SPEC-FV-051', () => {
  test('FV-051 mining a node gives ore', () => {
    const mine = new Mine();
    const inv = new Inventory();
    mine.addNode(3, 4, 'copper');
    mine.player.useToolAt(mine, 3, 4, 'pickaxe', inv);
    expect(mine.nodeAt(3, 4)).toBeNull();
    expect(inv.count('CopperOre')).toBeGreaterThan(0);
  });
});
