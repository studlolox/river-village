import { describe, test, expect } from 'vitest';
import { Festival } from '../js/sim/festival.js';

describe('SPEC-FV-100', () => {
  test('FV-100 festival grants a reward on completion', () => {
    const f = new Festival('Spring Egg Hunt');
    const r = f.playMinigame({ score: 10 });
    expect(r.reward).toBeDefined();
  });
});
