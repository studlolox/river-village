import { describe, test, expect } from 'vitest';
import { SfxManager } from '../js/render/audio.js';

describe('SPEC-FV-131', () => {
  test('FV-131 tool use plays the tool SFX', () => {
    const sfx = new SfxManager();
    sfx.play('hoe');
    expect(sfx.lastPlayed).toBe('hoe');
  });
});
