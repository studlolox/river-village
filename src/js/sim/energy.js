import economyData from '../../assets/economy.json' with { type: 'json' };
import { getCropDef } from './crop.js';

/**
 * Stamina and food consumption helpers.
 */
export const EnergySystem = {
  costForTool(tool) {
    return economyData.energyCosts[tool] ?? 2;
  },

  consume(player, amount) {
    if (player.energy < amount) return false;
    player.energy = Math.max(0, player.energy - amount);
    return true;
  },

  restore(player, amount) {
    player.energy = Math.min(player.maxEnergy, player.energy + amount);
  },

  eat(player, inv, itemId) {
    if (!inv.has(itemId, 1)) return false;
    const def = getCropDef(itemId);
    const e = def?.energyRestore ?? 15;
    const h = def?.hpRestore ?? 5;
    inv.remove(itemId, 1);
    player.energy = Math.min(player.maxEnergy, player.energy + e);
    player.hp = Math.min(player.maxHp, player.hp + h);
    return true;
  }
};
