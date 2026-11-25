/**
 * Stackable item inventory and tool belt.
 */
export class Inventory {
  constructor(initial = {}) {
    this.items = new Map();
    this.toolBelt = ['hoe', 'wateringCan', 'axe', 'pickaxe', 'sword', 'rod'];
    this.selectedToolIndex = 0;
    for (const [k, v] of Object.entries(initial)) {
      if (v > 0) this.items.set(k, v);
    }
  }

  _findKey(itemId) {
    if (this.items.has(itemId)) return itemId;
    const lower = itemId.toLowerCase();
    for (const k of this.items.keys()) {
      if (k.toLowerCase() === lower) return k;
    }
    return null;
  }

  add(itemId, qty = 1) {
    if (qty <= 0) return;
    const key = this._findKey(itemId) || itemId;
    this.items.set(key, (this.items.get(key) || 0) + qty);
  }

  remove(itemId, qty = 1) {
    const key = this._findKey(itemId);
    if (!key) return false;
    const cur = this.items.get(key) || 0;
    if (cur < qty) return false;
    if (cur === qty) this.items.delete(key);
    else this.items.set(key, cur - qty);
    return true;
  }

  count(itemId) {
    const key = this._findKey(itemId);
    return key ? this.items.get(key) || 0 : 0;
  }

  entries() {
    return Array.from(this.items.entries());
  }

  clear() {
    this.items.clear();
  }
}
