import { describe, test, expect } from 'vitest';
import { Blacksmith } from '../js/sim/blacksmith.js';

describe('SPEC-FV-122', () => {
  test('FV-122 cracking a geode yields a mineral or artifact', () => {
    const b = new Blacksmith();
    const result = b.crackGeode('CaveGeode');
    expect(['mineral', 'artifact']).toContain(result.item.category);
  });
});
