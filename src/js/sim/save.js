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

export const SAVE_SCHEMA_VERSION = 1;

/**
 * Versioned save/load manager using compact JSON payloads per slot.
 */
export class SaveManager {
  constructor(confirmHandler = null) {
    this.storage = getStorage();
    this.confirmHandler = confirmHandler;
  }

  _key(slot) {
    return `river_village_save_slot_${slot}`;
  }

  save(slot, state) {
    const payload = {
      schemaVersion: SAVE_SCHEMA_VERSION,
      savedAt: Date.now(),
      state,
    };
    this.storage.setItem(this._key(slot), JSON.stringify(payload));
    return payload;
  }

  load(slot) {
    const raw = this.storage.getItem(this._key(slot));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return this._migrate(parsed).state;
  }

  hasSave(slot) {
    return this.storage.getItem(this._key(slot)) !== null;
  }

  _migrate(payload) {
    if (!payload.schemaVersion) {
      return { schemaVersion: SAVE_SCHEMA_VERSION, savedAt: Date.now(), state: payload };
    }
    return payload;
  }

  confirmDelete(slot) {
    let confirmed = true;
    if (typeof this.confirmHandler === 'function') {
      confirmed = Boolean(this.confirmHandler(`Delete save slot ${slot}?`));
    } else if (typeof globalThis.window !== 'undefined' && typeof globalThis.window.confirm === 'function') {
      confirmed = globalThis.window.confirm(`Delete save slot ${slot}?`);
    }
    if (confirmed) {
      this.storage.removeItem(this._key(slot));
    }
    return confirmed;
  }
}
