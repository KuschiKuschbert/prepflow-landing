import { Recipe } from '../../types';
import { RecipeIngredientWithDetails } from '../../types';

/**
 * Pre-calculate prices for first page of recipes.
 *
 * @param {Recipe[]} recipes - Recipes to pre-calculate prices for
 * @param {Set<string>} pricesCalculatedRef - Ref tracking which recipes have had prices calculated
 * @param {Function} updateVisibleRecipePrices - Function to update visible recipe prices
 * @param {Function} fetchRecipeIngredients - Function to fetch recipe ingredients
 * @param {Function} fetchBatchRecipeIngredients - Function to fetch batch recipe ingredients
 */
export function precalculatePrices(
  recipes: Recipe[],
  pricesCalculatedRef: React.MutableRefObject<Set<string>>,
  updateVisibleRecipePrices: (
    recipes: Recipe[],
    fetchRecipeIngredients: (recipeId: string) => Promise<RecipeIngredientWithDetails[]>,
    fetchBatchRecipeIngredients?: (
      recipeIds: string[],
    ) => Promise<Record<string, RecipeIngredientWithDetails[]>>,
  ) => Promise<void>,
  fetchRecipeIngredients: (recipeId: string) => Promise<RecipeIngredientWithDetails[]>,
  fetchBatchRecipeIngredients: (
    recipeIds: string[],
  ) => Promise<Record<string, RecipeIngredientWithDetails[]>>,
): void {
  const firstPageRecipes = recipes.slice(0, 10);
  const recipesNeedingPrices = firstPageRecipes.filter(
    (recipe: Recipe) => !pricesCalculatedRef.current.has(recipe.id),
  );

  if (recipesNeedingPrices.length > 0) {
    recipesNeedingPrices.forEach((recipe: Recipe) => pricesCalculatedRef.current.add(recipe.id));
    console.log(
      '[RecipeManagement] Pre-calculating prices for',
      recipesNeedingPrices.length,
      'recipes',
    );
    updateVisibleRecipePrices(
      recipesNeedingPrices,
      fetchRecipeIngredients,
      fetchBatchRecipeIngredients,
    )
      .then(() => {
        console.log('[RecipeManagement] Pre-calculated prices completed');
      })
      .catch(err => {
        console.error('[RecipeManagement] Background price calculation failed:', err);
        recipesNeedingPrices.forEach((recipe: Recipe) =>
          pricesCalculatedRef.current.delete(recipe.id),
        );
      });
  }
}
