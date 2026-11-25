import { describe, test, expect } from 'vitest';
import { HoldingMap } from '../js/sim/holding.js';

describe('SPEC-FV-012 Holding map', () => {
  test('FV-012 holding has tillable soil and building plots', () => {
    const m = new HoldingMap();
    expect(m.countTiles('tillable')).toBeGreaterThan(0);
    expect(m.countTiles('tree')).toBeGreaterThan(0);
    expect(m.emptyBuildingPlots().length).toBeGreaterThan(0);
  });
});
