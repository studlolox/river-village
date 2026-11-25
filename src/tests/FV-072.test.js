import { describe, test, expect } from 'vitest';
import { World } from '../js/sim/world.js';

describe('SPEC-FV-072 Resource regeneration', () => {
  test('FV-072 season change respawns debris and forage', () => {
    const w = new World();
    w.clearAllDebris();
    w.advanceSeason();
    expect(w.countDebris()).toBeGreaterThan(0);
    expect(w.countForage()).toBeGreaterThan(0);
  });
});
