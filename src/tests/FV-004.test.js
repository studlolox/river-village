import { describe, test, expect } from 'vitest';
import { SaveManager } from '../js/sim/save.js';

describe('SPEC-FV-004 Save / load', () => {
  test('FV-004 save and load restores state', () => {
    const m = new SaveManager();
    m.save(1, { day: 5, gold: 120, x: 10, y: 10 });
    const loaded = m.load(1);
    expect(loaded.schemaVersion).toBe(1);
    expect(loaded.day).toBe(5);
    expect(loaded.gold).toBe(120);
    expect(m.confirmDelete(1)).toBe(true);
  });
});
