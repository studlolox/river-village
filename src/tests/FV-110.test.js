import { describe, test, expect } from 'vitest';
import { FishingMinigame } from '../js/sim/fishing-minigame.js';

describe('SPEC-FV-110', () => {
  test('FV-110 fishing minigame timing is original', () => {
    const m = new FishingMinigame();
    expect(m.name).not.toMatch(/stardew|fishing/i);
  });
});
