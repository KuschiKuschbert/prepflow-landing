/**
 * Normalize recipe data for sharing (ensures ingredient_name is present).
 *
 * @param {Object} recipe - Raw recipe data from database
 * @returns {Object} Normalized recipe data
 */
export function normalizeRecipeForShare(recipe: any) {
  return {
    ...recipe,
    recipe_ingredients: (recipe.recipe_ingredients || []).map((ri: any) => ({
      ...ri,
      ingredients: {
        ...ri.ingredients,
        ingredient_name: ri.ingredients?.ingredient_name || ri.ingredients?.name,
      },
    })),
  };
}
