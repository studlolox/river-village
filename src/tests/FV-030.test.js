import { describe, test, expect } from 'vitest';
import { Farm } from '../js/sim/farm.js';

describe('SPEC-FV-030', () => {
  test('FV-030 hoe turns dirt into tilled soil', () => {
    const f = new Farm();
    f.setTile(2, 2, 'dirt');
    f.useTool(2, 2, 'hoe');
    expect(f.tileAt(2, 2).kind).toBe('tilled');
  });
});
