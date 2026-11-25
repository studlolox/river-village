import { describe, test, expect } from 'vitest';
import { World } from '../js/sim/world.js';

describe('SPEC-FV-021 Region travel', () => {
  test('FV-021 stepping on a warp switches regions', () => {
    const w = new World();
    w.player.gridPos = { x: 24, y: 6 }; // east edge of village
    w.update();
    expect(w.currentRegion).toBe('Forest');
  });
});
