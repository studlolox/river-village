import { describe, test, expect } from 'vitest';
import { Animal } from '../js/sim/animal.js';

describe('SPEC-FV-042 Animal care', () => {
  test('FV-042 cared-for animal produces a product', () => {
    const a = new Animal('RiverHen');
    a.feed();
    a.pet();
    const product = a.collectProduct();
    expect(product.kind).toBe('Egg');
    expect(product.quality).toBeDefined();
  });
});
