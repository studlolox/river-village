import { describe, test, expect } from 'vitest';
import { Farm } from '../js/sim/farm.js';
import { Inventory } from '../js/sim/inventory.js';

describe('SPEC-FV-032 Watering', () => {
  test('FV-032 watering marks tile watered; unwatered does not grow', () => {
    const f = new Farm();
    f.useTool(2, 2, 'hoe');
    f.plant(2, 2, 'springRootSeed', new Inventory({ springRootSeed: 1 }));
    f.water(2, 2);
    expect(f.tileAt(2, 2).watered).toBe(true);

    const f2 = new Farm();
    f2.useTool(3, 3, 'hoe');
    f2.plant(3, 3, 'springRootSeed', new Inventory({ springRootSeed: 1 }));
    f2.advanceDay();
    expect(f2.tileAt(3, 3).crop.stage).toBe('seed');
  });
});
