import { describe, test, expect } from 'vitest';
import { Farm } from '../js/sim/farm.js';
import { Inventory } from '../js/sim/inventory.js';

describe('SPEC-FV-031', () => {
  test('FV-031 planting consumes seed and shows seed stage', () => {
    const f = new Farm();
    const inv = new Inventory();
    inv.add('springRootSeed', 1);
    f.plant(2, 2, 'springRootSeed', inv);
    expect(f.tileAt(2, 2).crop.stage).toBe('seed');
    expect(inv.count('springRootSeed')).toBe(0);
  });
});
