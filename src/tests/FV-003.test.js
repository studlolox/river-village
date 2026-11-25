import { describe, test, expect } from 'vitest';
import { Settings } from '../js/sim/settings.js';

describe('SPEC-FV-003 Settings panel', () => {
  test('FV-003 music toggle persists', () => {
    const s = new Settings();
    s.setMusicEnabled(false);
    expect(s.isMusicEnabled()).toBe(false);
    const s2 = new Settings();
    expect(s2.isMusicEnabled()).toBe(false);
    s2.setMusicEnabled(true);
  });
});
