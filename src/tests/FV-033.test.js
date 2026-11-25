import { describe, test, expect } from 'vitest';
import { Farm } from '../js/sim/farm.js';
import { Inventory } from '../js/sim/inventory.js';

describe('SPEC-FV-033', () => {
  test('FV-033 crop advances growth stages per watered day', () => {
    const f = new Farm();
    f.plant(2, 2, 'springRootSeed', new Inventory());
    f.water(2, 2);
    for (let i = 0; i < 3; i++) {
      f.water(2, 2);
      f.advanceDay();
    }
    expect(f.tileAt(2, 2).crop.stage).toBe('mature');
  });
});
