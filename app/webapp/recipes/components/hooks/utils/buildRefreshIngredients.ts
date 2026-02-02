import { Recipe, RecipeIngredientWithDetails } from '@/lib/types/recipes';

/**
 * Build handleRefreshIngredients function.
 *
 * @param {Object} params - Refresh parameters
 */
export function buildRefreshIngredients({
  selectedRecipe,
  fetchRecipeIngredients,
  setRecipeIngredients,
}: {
  selectedRecipe: Recipe | null;
  fetchRecipeIngredients: (recipeId: string) => Promise<RecipeIngredientWithDetails[]>;
  setRecipeIngredients: (ingredients: RecipeIngredientWithDetails[]) => void;
}) {
  return async () => {
    if (!selectedRecipe) return;
    const ingredients = await fetchRecipeIngredients(selectedRecipe.id);
    setRecipeIngredients(ingredients);
  };
}
