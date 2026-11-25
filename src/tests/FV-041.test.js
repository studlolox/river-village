import { describe, test, expect } from 'vitest';
import { ReedsMarket } from '../js/sim/shop.js';
import { Player } from '../js/sim/player.js';
import { Holding } from '../js/sim/building.js';

describe('SPEC-FV-041', () => {
  test('FV-041 buying an animal deducts gold and places it', () => {
    const m = new ReedsMarket();
    const p = new Player({ gold: 1000 });
    const h = new Holding();
    h.placeBuilding('coop', 9, 5);
    m.buyAnimal(p, h, 'RiverHen', 9, 5);
    expect(p.gold).toBeLessThan(1000);
    expect(h.animalAt(9, 5).kind).toBe('RiverHen');
  });
});
