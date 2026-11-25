import { describe, test, expect } from 'vitest';
import { Mine } from '../js/sim/mine.js';

describe('SPEC-FV-054', () => {
  test('FV-054 ladder descends; floor 5 is a checkpoint', () => {
    const mine = new Mine();
    mine.player.gridPos = mine.ladderPos;
    mine.descend();
    expect(mine.floor).toBe(2);
    expect(mine.checkpoint).toBe(0);
    for (let f = 2; f < 5; f++) mine.descend();
    expect(mine.checkpoint).toBe(5);
  });
});
