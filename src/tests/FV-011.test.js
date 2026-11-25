import { describe, test, expect } from 'vitest';
import { Game } from '../js/sim/game.js';

describe('SPEC-FV-011 Player bedroom / sleep', () => {
  test('FV-011 sleep advances day and restores stats', () => {
    const g = new Game();
    g.energy = 10;
    g.hp = 5;
    g.date.day = 3;
    g.sleep();
    expect(g.date.day).toBe(4);
    expect(g.energy).toBe(g.maxEnergy);
    expect(g.hp).toBe(g.maxHp);
    expect(g.time).toBe(6 * 60);
    expect(g.player.location).toBe('Bedroom');
  });
});
