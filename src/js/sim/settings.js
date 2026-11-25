const memoryStorage = new Map();

function getStorage() {
  if (typeof globalThis.localStorage !== 'undefined') {
    return globalThis.localStorage;
  }
  return {
    getItem: (k) => (memoryStorage.has(k) ? memoryStorage.get(k) : null),
    setItem: (k, v) => memoryStorage.set(k, String(v)),
    removeItem: (k) => memoryStorage.delete(k),
  };
}

const SETTINGS_KEY = 'river_village_settings_v1';

/**
 * Persistent user preferences for audio, controls, and accessibility.
 */
export class Settings {
  constructor() {
    this.storage = getStorage();
    this.data = {
      musicEnabled: true,
      sfxEnabled: true,
      musicVolume: 0.7,
      sfxVolume: 0.8,
      touchDpadSide: 'left',
    };
    this._load();
  }

  _load() {
    try {
      const raw = this.storage.getItem(SETTINGS_KEY);
      if (raw) {
        Object.assign(this.data, JSON.parse(raw));
      }
    } catch {
      // Ignore malformed storage and keep defaults
    }
  }

  _save() {
    this.storage.setItem(SETTINGS_KEY, JSON.stringify(this.data));
  }

  setMusicEnabled(enabled) {
    this.data.musicEnabled = Boolean(enabled);
    this._save();
  }

  isMusicEnabled() {
    return Boolean(this.data.musicEnabled);
  }

  setSfxEnabled(enabled) {
    this.data.sfxEnabled = Boolean(enabled);
    this._save();
  }

  isSfxEnabled() {
    return Boolean(this.data.sfxEnabled);
  }

  setTouchDpadSide(side) {
    this.data.touchDpadSide = side === 'right' ? 'right' : 'left';
    this._save();
  }

  getTouchDpadSide() {
    return this.data.touchDpadSide;
  }
}
