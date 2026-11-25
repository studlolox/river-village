import { describe, test, expect } from 'vitest';
import { Character, Game } from '../js/sim/game.js';

describe('SPEC-FV-010', () => {
  test('FV-010 character creation sets starting state', () => {
    const c = new Character('Aria', 'Honeysuckle Holding');
    const g = new Game(c);
    g.start();
    expect(g.player.name).toBe('Aria');
    expect(g.holding.name).toBe('Honeysuckle Holding');
    expect(g.date).toEqual({ season: 'Spring', day: 1, year: 1 });
    expect(g.time).toBe(6 * 60);
    expect(g.player.location).toBe('Bedroom');
  });
});
