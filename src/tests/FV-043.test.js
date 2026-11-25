import { describe, test, expect } from 'vitest';
import { Animal } from '../js/sim/animal.js';

describe('SPEC-FV-043', () => {
  test('FV-043 affection rises with care and improves quality', () => {
    const a = new Animal('RiverHen');
    for (let i = 0; i < 10; i++) {
      a.feed();
      a.pet();
    }
    expect(a.affection).toBeGreaterThan(0);
    expect(a.collectProduct().quality).toBe('large');
  });
});
