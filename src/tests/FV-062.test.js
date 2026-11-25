import { describe, test, expect } from 'vitest';
import { Player } from '../js/sim/player.js';

describe('SPEC-FV-062', () => {
  test('FV-062 catching fish raises fishing level', () => {
    const p = new Player();
    p.fishing.catchFish();
    expect(p.fishing.level).toBeGreaterThan(1);
  });
});
