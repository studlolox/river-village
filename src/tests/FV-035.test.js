import { describe, test, expect } from 'vitest';
import { Farm } from '../js/sim/farm.js';
import { Player } from '../js/sim/player.js';

describe('SPEC-FV-035', () => {
  test('FV-035 upgraded hoe tills a 3x3 area', () => {
    const f = new Farm();
    const p = new Player({ tool: 'hoe', upgraded: true });
    p.useToolAt(f, 5, 5);
    const around = [[5,5],[4,5],[6,5],[5,4],[5,6],[4,4],[6,6],[4,6],[6,4]];
    around.forEach(([x, y]) => expect(f.tileAt(x, y).kind).toBe('tilled'));
  });
});
