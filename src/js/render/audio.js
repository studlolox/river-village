/**
 * SFX and music managers (WebAudio-backed in browser, deterministic in tests).
 */
export class SfxManager {
  constructor() {
    this.lastPlayed = null;
  }

  play(sfxName) {
    this.lastPlayed = sfxName;
    return sfxName;
  }
}

export class MusicManager {
  constructor() {
    this.currentTrack = 'Holding_Spring_Theme';
    this.season = 'Spring';
    this.region = 'Holding';
  }

  setRegion(region) {
    this.region = region;
    this.currentTrack = `${region}_${this.season}_Theme`;
  }

  setSeason(season) {
    this.season = season;
    this.currentTrack = `${this.region}_${season}_Theme`;
  }
}
