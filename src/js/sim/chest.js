function normKey(id) {
  return String(id).trim().toLowerCase();
}

/**
 * Persistent storage chest for holding items.
 */
export class Chest {
  constructor(maxSlots = 24) {
    this.maxSlots = maxSlots;
    this._stacks = new Map();
  }

  store(inv, itemId, qty = 1) {
    if (!inv.has(itemId, qty)) return false;
    const key = normKey(itemId);
    const existing = this._stacks.get(key);
    if (!existing && this._stacks.size >= this.maxSlots) return false;
    inv.remove(itemId, qty);
    if (existing) {
      existing.qty += qty;
    } else {
      this._stacks.set(key, { id: itemId, qty });
    }
    return true;
  }

  take(inv, itemId, qty = 1) {
    const key = normKey(itemId);
    const existing = this._stacks.get(key);
    if (!existing || existing.qty < qty) return false;
    if (!inv.add(existing.id, qty)) return false;
    existing.qty -= qty;
    if (existing.qty <= 0) this._stacks.delete(key);
    return true;
  }

  quickStack(inv) {
    let moved = 0;
    for (const entry of inv.entries()) {
      if (this._stacks.has(normKey(entry.id))) {
        if (this.store(inv, entry.id, entry.qty)) moved += entry.qty;
      }
    }
    return moved;
  }

  depositAll(inv) {
    let moved = 0;
    for (const entry of inv.entries()) {
      if (this.store(inv, entry.id, entry.qty)) moved += entry.qty;
    }
    return moved;
  }

  count(itemId) {
    const existing = this._stacks.get(normKey(itemId));
    return existing ? existing.qty : 0;
  }

  entries() {
    return Array.from(this._stacks.values()).map((e) => ({ ...e }));
  }
}
