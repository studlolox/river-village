import { describe, test, expect } from 'vitest';
import { ArcadeCabinet } from '../js/sim/arcade.js';

describe('SPEC-FV-112', () => {
  test('FV-112 arcade awards tokens for score', () => {
    const a = new ArcadeCabinet();
    const tokens = a.play({ score: 5000 });
    expect(tokens).toBeGreaterThan(0);
  });
});
