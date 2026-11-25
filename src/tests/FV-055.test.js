import { describe, test, expect } from 'vitest';
import { Game } from '../js/sim/game.js';

describe('SPEC-FV-055 Health & energy', () => {
  test('FV-055 zero HP sends player to the clinic', () => {
    const g = new Game();
    g.player.hp = 0;
    g.handlePlayerDefeat();
    expect(g.player.location).toBe('Clinic');
    expect(g.player.hp).toBeGreaterThan(0);
  });
});
