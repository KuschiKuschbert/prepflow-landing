/**
 * Normalize recipe data for sharing (ensures ingredient_name is present).
 */
export function normalizeRecipeForShare(recipe: Record<string, unknown>) {
  const riList = Array.isArray(recipe.recipe_ingredients) ? recipe.recipe_ingredients : [];
  return {
    ...recipe,
    recipe_ingredients: riList.map((ri: Record<string, unknown>) => {
      const ing = ri.ingredients as Record<string, unknown> | undefined;
      return {
        ...ri,
        ingredients: {
          ...ing,
          ingredient_name: (ing?.ingredient_name as string) || (ing?.name as string),
        },
      };
    }),
  };
}
