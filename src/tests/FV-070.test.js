import { describe, test, expect } from 'vitest';
import { World } from '../js/sim/world.js';
import { Inventory } from '../js/sim/inventory.js';

describe('SPEC-FV-070 Forageables', () => {
  test('FV-070 picking up forage adds to inventory', () => {
    const w = new World();
    const inv = new Inventory();
    w.addForage(4, 5, 'SpringOnion');
    w.player.interactAt(w, 4, 5, inv);
    expect(inv.count('SpringOnion')).toBe(1);
    expect(w.forageAt(4, 5)).toBeNull();
  });
});
