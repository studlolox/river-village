import { ReedsMarket as MarketSchedule } from './time.js';

const CATALOG = {
  springrootseed: { id: 'SpringRootSeed', price: 20 },
  sunmelonseed: { id: 'SunMelonSeed', price: 40 },
  ambercornseed: { id: 'AmberCornSeed', price: 50 },
  frostberryseed: { id: 'FrostBerrySeed', price: 35 },
};

const ANIMAL_PRICES = {
  riverhen: 400,
  woolyEwe: 600,
  woolyewe: 600,
  meadowcow: 800,
  brookduck: 450,
  mossgoat: 700,
};

/**
 * Maren Reed's general store in River Village.
 */
export class ReedsMarket {
  static isOpen(timeOfDay) {
    return MarketSchedule.isOpen(timeOfDay);
  }

  buy(player, inventory, itemId, qty = 1) {
    const entry = CATALOG[String(itemId || '').toLowerCase()] || { id: itemId, price: 20 };
    const cost = entry.price * qty;
    if (player.gold < cost) return false;
    player.gold -= cost;
    inventory.add(entry.id, qty);
    return true;
  }

  buyAnimal(player, holding, animalKind, x, y) {
    const cost = ANIMAL_PRICES[String(animalKind || '').toLowerCase()] ?? 400;
    if (player.gold < cost) return false;
    const placed = holding.addAnimal(animalKind, x, y);
    if (!placed) return false;
    player.gold -= cost;
    return true;
  }
}
