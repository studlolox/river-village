import { describe, test, expect } from 'vitest';
import { World } from '../js/sim/world.js';
import { Inventory } from '../js/sim/inventory.js';

describe('SPEC-FV-071 Trees & debris', () => {
  test('FV-071 chopping a tree yields wood', () => {
    const w = new World();
    const inv = new Inventory();
    w.addTree(7, 8);
    w.player.useToolAt(w, 7, 8, 'axe', inv);
    expect(inv.count('Wood')).toBeGreaterThan(0);
    expect(w.treeAt(7, 8)).toBeNull();
  });
});
