export const SCHEMA_VERSION = 1;
const SLOT_PREFIX = 'river_village_save_slot_';

const memoryStorage = new Map();

function getStorage() {
  if (typeof globalThis !== 'undefined' && globalThis.localStorage) {
    return globalThis.localStorage;
  }
  return {
    getItem: (k) => (memoryStorage.has(k) ? memoryStorage.get(k) : null),
    setItem: (k, v) => memoryStorage.set(k, String(v)),
    removeItem: (k) => memoryStorage.delete(k)
  };
}

/**
 * Encodes a 2D tile map or sparse record into compact sparse diffs.
 */
export function encodeSparseTiles(tiles) {
  if (!Array.isArray(tiles)) return tiles;
  const diffs = [];
  for (let i = 0; i < tiles.length; i++) {
    const t = tiles[i];
    if (t && t.modified) {
      diffs.push([t.x, t.y, t.kind, t.watered ? 1 : 0, t.crop || null]);
    }
  }
  return diffs;
}

/**
 * Versioned 3-slot save manager with compact sparse serialization and delete confirmation.
 */
export class SaveManager {
  constructor() {
    this._storage = getStorage();
    this._pendingDeleteSlot = null;
  }

  _key(slot) {
    if (slot < 1 || slot > 3) {
      throw new Error(`Invalid save slot: ${slot}. Must be 1, 2, or 3.`);
    }
    return `${SLOT_PREFIX}${slot}`;
  }

  save(slot, state) {
    const payload = {
      schemaVersion: SCHEMA_VERSION,
      savedAt: Date.now(),
      ...state
    };
    if (Array.isArray(state.tiles)) {
      payload.tileDiffs = encodeSparseTiles(state.tiles);
      delete payload.tiles;
    }
    const serialized = JSON.stringify(payload);
    this._storage.setItem(this._key(slot), serialized);
    return payload;
  }

  load(slot) {
    const raw = this._storage.getItem(this._key(slot));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return this.migrate(parsed);
  }

  migrate(data) {
    if (!data || typeof data !== 'object') return null;
    const version = data.schemaVersion ?? 0;
    if (version < 1) {
      data.schemaVersion = 1;
    }
    return data;
  }

  /**
   * Records non-blocking delete confirmation intent for UI and returns true if slot exists.
   */
  confirmDelete(slot) {
    const exists = this.load(slot) !== null;
    this._pendingDeleteSlot = exists ? slot : null;
    return exists;
  }

  getPendingDeleteSlot() {
    return this._pendingDeleteSlot;
  }

  cancelDelete() {
    this._pendingDeleteSlot = null;
  }

  deleteSlot(slot) {
    this._storage.removeItem(this._key(slot));
    if (this._pendingDeleteSlot === slot) {
      this._pendingDeleteSlot = null;
    }
  }

  listSlots() {
    return [1, 2, 3].map((slot) => ({
      slot,
      data: this.load(slot)
    }));
  }
}
