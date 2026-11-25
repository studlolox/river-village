import { describe, test, expect } from 'vitest';
import { Animal } from '../js/sim/animal.js';

describe('SPEC-FV-044 Animal naming', () => {
  test('FV-044 animal name is saved and shown', () => {
    const a = new Animal('RiverHen');
    a.name = 'Nibbles';
    expect(a.uiLabel()).toBe('Nibbles');
  });
});
