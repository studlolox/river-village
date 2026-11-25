import { describe, test, expect } from 'vitest';
import { FishingSpot, Rod } from '../js/sim/fishing.js';

describe('SPEC-FV-060', () => {
  test('FV-060 casting starts the fishing minigame', () => {
    const s = new FishingSpot('River');
    const r = new Rod();
    const result = s.cast(r);
    expect(result.minigameActive).toBe(true);
    expect(result.spot).toBe('River');
  });
});
