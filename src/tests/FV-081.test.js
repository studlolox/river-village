import { describe, test, expect } from 'vitest';
import { Crafting } from '../js/sim/crafting.js';
import { Inventory } from '../js/sim/inventory.js';

describe('SPEC-FV-081 Crafting menu', () => {
  test('FV-081 crafting consumes materials and yields the item', () => {
    const c = new Crafting();
    const inv = new Inventory();
    inv.add('Wood', 50);
    inv.add('Stone', 20);
    const ok = c.craft(inv, 'Chest');
    expect(ok).toBe(true);
    expect(inv.count('Wood')).toBe(0);
  });
});
