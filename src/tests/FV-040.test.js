import { describe, test, expect } from 'vitest';
import { Holding } from '../js/sim/building.js';

describe('SPEC-FV-040', () => {
  test('FV-040 barn and coop house animals', () => {
    const h = new Holding();
    h.placeBuilding('barn', 5, 5);
    h.placeBuilding('coop', 9, 5);
    expect(h.buildingAt(5, 5).type).toBe('barn');
    expect(h.buildingAt(9, 5).type).toBe('coop');
  });
});
