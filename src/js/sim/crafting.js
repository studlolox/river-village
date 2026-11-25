export const BASIC_RECIPES = {
  Chest: { id: 'Chest', ingredients: { Wood: 50 }, category: 'utility' },
  Fence: { id: 'Fence', ingredients: { Wood: 5 }, category: 'utility' },
  Path: { id: 'Path', ingredients: { Stone: 2 }, category: 'utility' },
  BasicSprinkler: { id: 'BasicSprinkler', ingredients: { CopperBar: 1, IronBar: 1 }, category: 'automation' },
  Furnace: { id: 'Furnace', ingredients: { CopperOre: 20, Stone: 25 }, category: 'utility' }
};

/**
 * Crafting system (Part 1: basic utility recipes; Part 2 artisan recipes added in Phase 5).
 */
export class Crafting {
  constructor(extraRecipes = {}) {
    this.recipes = { ...BASIC_RECIPES, ...extraRecipes };
  }

  listRecipes() {
    return Object.values(this.recipes);
  }

  canCraft(inv, recipeId) {
    const recipe = this.recipes[recipeId];
    if (!recipe) return false;
    for (const [mat, qty] of Object.entries(recipe.ingredients)) {
      if (!inv.has(mat, qty)) return false;
    }
    return true;
  }

  craft(inv, recipeId) {
    if (!this.canCraft(inv, recipeId)) return false;
    const recipe = this.recipes[recipeId];
    for (const [mat, qty] of Object.entries(recipe.ingredients)) {
      inv.remove(mat, qty);
    }
    inv.add(recipe.id, 1);
    return true;
  }
}
