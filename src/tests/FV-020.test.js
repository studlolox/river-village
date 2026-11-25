import { describe, test, expect } from 'vitest';
import { Player } from '../js/sim/player.js';

describe('SPEC-FV-020', () => {
  test('FV-020 movement moves one grid tile per input', () => {
    const p = new Player({ x: 0, y: 0 });
    p.handleInput('down');
    expect(p.gridPos).toEqual({ x: 0, y: 1 });
    p.handleInput('right');
    expect(p.gridPos).toEqual({ x: 1, y: 1 });
  });
});
