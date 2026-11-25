import { describe, test, expect } from 'vitest';
import { MusicManager } from '../js/render/audio.js';

describe('SPEC-FV-130', () => {
  test('FV-130 region music switches on region change', () => {
    const music = new MusicManager();
    music.setRegion('Forest');
    expect(music.currentTrack).toContain('Forest');
  });
});
