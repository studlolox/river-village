import { describe, test, expect } from 'vitest';
import { Farm } from '../js/sim/farm.js';
import { Inventory } from '../js/sim/inventory.js';

describe('SPEC-FV-034 Harvesting', () => {
  test('FV-034 harvesting puts produce in inventory', () => {
    const f = new Farm();
    const inv = new Inventory({ springRootSeed: 1 });
    f.useTool(2, 2, 'hoe');
    f.plant(2, 2, 'springRootSeed', inv);
    for (let i = 0; i < 3; i++) {
      f.water(2, 2);
      f.advanceDay();
    }
    f.harvest(2, 2, inv);
    expect(f.tileAt(2, 2).crop).toBeNull();
    expect(inv.count('springRoot')).toBeGreaterThan(0);
  });
});
