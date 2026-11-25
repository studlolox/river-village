import { describe, test, expect } from 'vitest';
import { Mine } from '../js/sim/mine.js';

describe('SPEC-FV-050', () => {
  test('FV-050 entering the Deep Warrens loads floor 1', () => {
    const mine = new Mine();
    mine.enter(1);
    expect(mine.floor).toBe(1);
    expect(mine.player.gridPos).toBeDefined();
  });
});
