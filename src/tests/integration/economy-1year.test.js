import { describe, test, expect } from 'vitest';
import { Game } from '../../js/sim/game.js';

describe('Integration: 1-year headless farming economy simulator', () => {
  test('4 seasons (112 days) of farming yields sustainable gold without softlock', () => {
    const g = new Game();
    g.start();

    // Till a 4x2 plot inside the tillable zone (x: 4..7, y: 8..9)
    const coords = [];
    for (let x = 4; x <= 7; x++) {
      for (let y = 8; y <= 9; y++) {
        g.farm.useTool(x, y, 'hoe');
        coords.push([x, y]);
      }
    }

    for (let day = 1; day <= 112; day++) {
      const season = g.date.season;
      const seedId =
        season === 'Spring' ? 'springRootSeed' :
        season === 'Summer' ? 'sunMelonSeed' :
        season === 'Fall' ? 'autumnSquashSeed' : null;

      for (const [x, y] of coords) {
        const tile = g.farm.tileAt(x, y);
        if (tile.crop && tile.crop.isMature()) {
          g.farm.harvest(x, y, g.inventory);
        }
        if (!tile.crop && seedId) {
          if (!g.inventory.has(seedId, 1)) {
            g.market.buy(g.player, g.inventory, seedId, 1);
          }
          g.farm.plant(x, y, seedId, g.inventory);
        }
        if (tile.crop) {
          g.farm.water(x, y);
        }
      }

      // Ship harvested produce
      for (const item of g.inventory.entries()) {
        if (!item.id.toLowerCase().includes('seed')) {
          g.shippingBin.deposit(g.inventory, item.id, item.qty);
        }
      }

      g.sleep();
    }

    expect(g.date.year).toBe(2);
    expect(g.player.gold).toBeGreaterThan(2000);
    expect(g.player.gold).toBeLessThan(200000);
  });
});
