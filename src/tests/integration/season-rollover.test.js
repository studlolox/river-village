import { describe, test, expect } from 'vitest';
import { Game } from '../../js/sim/game.js';

describe('Integration: Season rollover & Village Restoration Ledger', () => {
  test('Sleeping past day 28 rolls season to Summer and respawns world resources', () => {
    const g = new Game();
    g.start();
    g.date.day = 28;
    g.world.clearAllDebris();
    g.sleep();
    expect(g.date).toEqual({ season: 'Summer', day: 1, year: 1 });
    expect(g.world.countDebris()).toBeGreaterThan(0);
    expect(g.world.countForage()).toBeGreaterThan(0);
  });

  test('Village Restoration Ledger completes milestone when materials provided', () => {
    const g = new Game();
    g.inventory.add('Wood', 50);
    g.inventory.add('Stone', 25);
    const ok = g.milestones.completeMilestone('bridgeRepair', g.inventory);
    expect(ok).toBe(true);
    expect(g.inventory.count('Wood')).toBe(0);
  });
});
