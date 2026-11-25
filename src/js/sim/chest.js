/**
 * Persistent storage chest for the player's holding.
 */
export class Chest {
  constructor() {
    this.items = new Map();
  }

  store(inventory, itemId, qty = 1) {
    if (!inventory.remove(itemId, qty)) return false;
    this.items.set(itemId, (this.items.get(itemId) || 0) + qty);
    return true;
  }

  withdraw(inventory, itemId, qty = 1) {
    const cur = this.items.get(itemId) || 0;
    if (cur < qty) return false;
    if (cur === qty) this.items.delete(itemId);
    else this.items.set(itemId, cur - qty);
    inventory.add(itemId, qty);
    return true;
  }

  count(itemId) {
    return this.items.get(itemId) || 0;
  }
}
