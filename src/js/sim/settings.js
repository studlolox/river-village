const STORAGE_KEY = 'river_village_settings_v1';

// In-memory fallback when running headless in Node/Vitest without localStorage
const memoryStorage = new Map();

function getStorage() {
  if (typeof globalThis !== 'undefined' && globalThis.localStorage) {
    return globalThis.localStorage;
  }
  return {
    getItem: (k) => (memoryStorage.has(k) ? memoryStorage.get(k) : null),
    setItem: (k, v) => memoryStorage.set(k, String(v))
  };
}

const DEFAULT_SETTINGS = {
  musicEnabled: true,
  sfxEnabled: true,
  screenShake: true,
  qualityMode: 'high', // 'high' | 'battery'
  dayLengthSeconds: 600, // 10 min default mobile day
  language: 'en'
};

/**
 * Persistent player preferences for audio, visuals, and mobile ergonomics.
 */
export class Settings {
  constructor() {
    this._storage = getStorage();
    this._data = { ...DEFAULT_SETTINGS };
    this._load();
  }

  _load() {
    try {
      const raw = this._storage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        this._data = { ...DEFAULT_SETTINGS, ...parsed };
      }
    } catch {
      this._data = { ...DEFAULT_SETTINGS };
    }
  }

  _persist() {
    this._storage.setItem(STORAGE_KEY, JSON.stringify(this._data));
  }

  setMusicEnabled(enabled) {
    this._data.musicEnabled = Boolean(enabled);
    this._persist();
  }

  isMusicEnabled() {
    return this._data.musicEnabled;
  }

  setSfxEnabled(enabled) {
    this._data.sfxEnabled = Boolean(enabled);
    this._persist();
  }

  isSfxEnabled() {
    return this._data.sfxEnabled;
  }

  setScreenShake(enabled) {
    this._data.screenShake = Boolean(enabled);
    this._persist();
  }

  isScreenShakeEnabled() {
    return this._data.screenShake;
  }

  setQualityMode(mode) {
    this._data.qualityMode = mode === 'battery' ? 'battery' : 'high';
    this._persist();
  }

  getQualityMode() {
    return this._data.qualityMode;
  }

  setDayLengthSeconds(seconds) {
    const clamped = Math.max(120, Math.min(1800, Number(seconds) || 600));
    this._data.dayLengthSeconds = clamped;
    this._persist();
  }

  getDayLengthSeconds() {
    return this._data.dayLengthSeconds;
  }

  getLanguage() {
    return this._data.language;
  }
}
