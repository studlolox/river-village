import { describe, test, expect } from 'vitest';
import { Inventory } from '../js/sim/inventory.js';
import { Chest } from '../js/sim/chest.js';

describe('SPEC-FV-085 Inventory', () => {
  test('FV-085 inventory stacks and chest persist', () => {
    const inv = new Inventory();
    inv.add('Wood', 10);
    inv.add('Wood', 10);
    expect(inv.count('Wood')).toBe(20);
    const chest = new Chest();
    chest.store(inv, 'Wood', 20);
    expect(chest.count('Wood')).toBe(20);
  });
});
