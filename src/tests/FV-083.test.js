import { describe, test, expect } from 'vitest';
import { ShippingBin } from '../js/sim/shipping.js';
import { Inventory } from '../js/sim/inventory.js';

describe('SPEC-FV-083', () => {
  test('FV-083 shipping bin pays for shipped items', () => {
    const bin = new ShippingBin();
    const inv = new Inventory();
    inv.add('SpringRoot', 3);
    const paid = bin.shipAll(inv);
    expect(paid).toBe(3 * 80);
  });
});
