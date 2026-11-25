import { describe, test, expect } from 'vitest';
import { Farm } from '../js/sim/farm.js';

describe('SPEC-FV-023', () => {
  test('FV-023 rain waters all outdoor crops automatically', () => {
    const f = new Farm();
    f.addCropAt({ x: 1, y: 1 }, 'springRoot');
    f.weather = 'rainy';
    f.applyWeatherWatering();
    expect(f.tileAt(1, 1).watered).toBe(true);
  });
});
