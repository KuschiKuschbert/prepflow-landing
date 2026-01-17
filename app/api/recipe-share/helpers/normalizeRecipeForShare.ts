/**
 * Normalize recipe data for sharing (ensures ingredient_name is present).
 */
export function normalizeRecipeForShare(recipe: Record<string, any>) {
  return {
    ...recipe,
    recipe_ingredients: (recipe.recipe_ingredients || []).map(
      (ri: Record<string, Record<string, unknown>>) => ({
        ...ri,
        ingredients: {
          ...ri.ingredients,
          ingredient_name: ri.ingredients?.ingredient_name || ri.ingredients?.name,
        },
      }),
    ),
  };
}
