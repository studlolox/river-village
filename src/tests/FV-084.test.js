import { describe, test, expect } from 'vitest';
import { ReedsMarket } from '../js/sim/shop.js';
import { Player } from '../js/sim/player.js';
import { Inventory } from '../js/sim/inventory.js';

describe('SPEC-FV-084 Reed\'s Market', () => {
  test('FV-084 buying seeds at Reed\'s Market', () => {
    const m = new ReedsMarket();
    const p = new Player({ gold: 200 });
    const inv = new Inventory();
    m.buy(p, inv, 'SpringRootSeed', 1);
    expect(p.gold).toBeLessThan(200);
    expect(inv.count('SpringRootSeed')).toBe(1);
  });
});
