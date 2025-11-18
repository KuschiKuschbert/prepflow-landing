/**
 * Collect recipe IDs and dish IDs from menu items.
 *
 * @param {any[]} menuItems - Menu items array
 * @returns {{recipeIds: Set<string>, dishIds: Set<string>, recipeInstructionsMap: Map<string, string | null>}} Collected IDs and instructions
 */
export function collectRecipeAndDishIds(menuItems: any[]) {
  const recipeIds = new Set<string>();
  const dishIds = new Set<string>();
  const recipeInstructionsMap = new Map<string, string | null>();

  for (const menuItem of menuItems) {
    if (menuItem.dish_id) {
      const dishes = (menuItem as any).dishes;
      if (dishes) {
        const dish = Array.isArray(dishes) ? dishes[0] : dishes;
        if (dish && dish.id) {
          dishIds.add(dish.id);
        }
      }
    }
    if (menuItem.recipe_id) {
      const recipes = (menuItem as any).recipes;
      if (recipes) {
        const recipe = Array.isArray(recipes) ? recipes[0] : recipes;
        if (recipe && recipe.id) {
          recipeIds.add(recipe.id);
          recipeInstructionsMap.set(recipe.id, recipe.instructions || null);
        }
      }
    }
  }

  return { recipeIds, dishIds, recipeInstructionsMap };
}
