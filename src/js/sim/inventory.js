function normKey(id) {
  return String(id).trim().toLowerCase();
}

/**
 * Stackable inventory with tool belt and capacity limit.
 */
export class Inventory {
  constructor(initialItems = null, maxSlots = 12) {
    this.maxSlots = maxSlots;
    this.toolBelt = ['hoe', 'wateringCan', 'axe', 'pickaxe', 'scythe'];
    this._stacks = new Map(); // normKey -> { id, qty }

    if (initialItems && typeof initialItems === 'object') {
      for (const [k, v] of Object.entries(initialItems)) {
        if (v > 0) this.add(k, v);
      }
    }
  }

  add(itemId, qty = 1) {
    if (qty <= 0) return false;
    const key = normKey(itemId);
    const existing = this._stacks.get(key);
    if (existing) {
      existing.qty += qty;
      return true;
    }
    if (this._stacks.size >= this.maxSlots) {
      return false;
    }
    this._stacks.set(key, { id: itemId, qty });
    return true;
  }

  remove(itemId, qty = 1) {
    if (qty <= 0) return true;
    const key = normKey(itemId);
    const existing = this._stacks.get(key);
    if (!existing || existing.qty < qty) return false;
    existing.qty -= qty;
    if (existing.qty <= 0) {
      this._stacks.delete(key);
    }
    return true;
  }

  count(itemId) {
    const existing = this._stacks.get(normKey(itemId));
    return existing ? existing.qty : 0;
  }

  has(itemId, qty = 1) {
    return this.count(itemId) >= qty;
  }

  entries() {
    return Array.from(this._stacks.values()).map((e) => ({ ...e }));
  }

  clear() {
    this._stacks.clear();
  }
}
