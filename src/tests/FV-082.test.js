import { describe, test, expect } from 'vitest';
import { Kitchen } from '../js/sim/kitchen.js';

describe('SPEC-FV-082', () => {
  test('FV-082 cooked dish restores energy', () => {
    const k = new Kitchen();
    const dish = k.cook('VegetableStew');
    expect(dish.energyRestore).toBeGreaterThan(0);
    expect(dish.hpRestore).toBeGreaterThan(0);
  });
});
