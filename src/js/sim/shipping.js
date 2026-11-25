const SELL_PRICES = {
  springroot: 80,
  sunmelon: 140,
  ambercorn: 60,
  frostberry: 95,
  wildberry: 35,
  springonion: 12,
  wood: 2,
  stone: 2,
  copperore: 10,
  egg: 50,
  riverdace: 45,
};

/**
 * End-of-day shipping bin that converts shipped items into gold.
 */
export class ShippingBin {
  priceOf(itemId) {
    return SELL_PRICES[String(itemId || '').toLowerCase()] ?? 10;
  }

  shipAll(inventory) {
    let total = 0;
    for (const [itemId, qty] of inventory.entries()) {
      total += this.priceOf(itemId) * qty;
    }
    inventory.clear();
    return total;
  }
}
