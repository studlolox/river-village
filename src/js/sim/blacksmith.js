import { crackGeodeItem } from './geode.js';

/**
 * Bramwell Forge's Blacksmith shop for tool upgrades and geode cracking.
 */
export class Blacksmith {
  upgradeTool(player, toolName, cost = 500, oreRequired = 5) {
    if (player.gold < cost) return false;
    const inv = player.inventoryMap;
    if (inv && (inv.CopperOre || 0) < oreRequired) return false;
    if (inv) {
      inv.CopperOre -= oreRequired;
    }
    player.gold -= cost;
    if (!player.tools[toolName]) {
      player.tools[toolName] = { tier: 1 };
    }
    player.tools[toolName].tier += 1;
    player.upgradedTools.add(toolName);
    return true;
  }

  crackGeode(geodeKind = 'CaveGeode') {
    const item = crackGeodeItem(geodeKind);
    return { geodeKind, item };
  }
}
