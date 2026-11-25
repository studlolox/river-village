import economyData from '../../assets/economy.json' with { type: 'json' };
import { ReedsMarketHours } from './time.js';

/**
 * Reed's Market run by Maren Reed, selling seasonal seeds and supplies.
 */
export class ReedsMarket {
  constructor() {
    this.npcName = 'Maren Reed';
  }

  static isOpen(timeOfDay) {
    return ReedsMarketHours.isOpen(timeOfDay);
  }

  getStock(season = 'Spring') {
    return economyData.shopStock[season] || [];
  }

  getPrice(itemId) {
    const norm = String(itemId).toLowerCase();
    for (const items of Object.values(economyData.shopStock)) {
      for (const item of items) {
        if (
          item.id.toLowerCase() === norm ||
          (item.alias && item.alias.toLowerCase() === norm)
        ) {
          return item.price;
        }
      }
    }
    return 20;
  }

  buy(player, inv, itemId, qty = 1) {
    if (qty <= 0) return false;
    const cost = this.getPrice(itemId) * qty;
    if (player.gold < cost) return false;
    if (!inv.add(itemId, qty)) return false;
    player.gold -= cost;
    return true;
  }
}
