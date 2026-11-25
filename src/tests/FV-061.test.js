import { describe, test, expect } from 'vitest';
import { FishingMinigame } from '../js/sim/fishing-minigame.js';

describe('SPEC-FV-061', () => {
  test('FV-061 successful reel catches a fish', () => {
    const m = new FishingMinigame();
    m.timingHit = true;
    const fish = m.resolve();
    expect(fish.kind).toBe('RiverDace');
    expect(fish.size).toBeDefined();
  });
});
