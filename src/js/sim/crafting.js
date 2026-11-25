const CRAFT_RECIPES = {
  Chest: { Wood: 50 },
  Fence: { Wood: 2 },
  Sprinkler: { CopperOre: 5, Stone: 5 },
  Keg: { Wood: 30, CopperOre: 2 },
};

export class Crafting {
  craft(inventory, recipeName) {
    const reqs = CRAFT_RECIPES[recipeName];
    if (!reqs) return false;
    for (const [mat, qty] of Object.entries(reqs)) {
      if (inventory.count(mat) < qty) return false;
    }
    for (const [mat, qty] of Object.entries(reqs)) {
      inventory.remove(mat, qty);
    }
    inventory.add(recipeName, 1);
    return true;
  }
}
