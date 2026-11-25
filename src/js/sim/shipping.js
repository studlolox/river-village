import economyData from '../../assets/economy.json' with { type: 'json' };

const SELL_PRICES = new Map(
  Object.entries(economyData.sellPrices).map(([k, v]) => [k.toLowerCase(), v])
);

/**
 * Shipping bin for selling produce and materials at day-end or on demand.
 */
export class ShippingBin {
  constructor() {
    this.queued = [];
  }

  priceOf(itemId) {
    return SELL_PRICES.get(String(itemId).toLowerCase()) ?? 5;
  }

  deposit(inv, itemId, qty = 1) {
    if (!inv.remove(itemId, qty)) return false;
    this.queued.push({ id: itemId, qty });
    return true;
  }

  shipAll(inv = null) {
    let total = 0;
    if (inv) {
      for (const entry of inv.entries()) {
        const price = this.priceOf(entry.id);
        total += price * entry.qty;
        inv.remove(entry.id, entry.qty);
      }
    }
    for (const item of this.queued) {
      total += this.priceOf(item.id) * item.qty;
    }
    this.queued = [];
    return total;
  }
}
