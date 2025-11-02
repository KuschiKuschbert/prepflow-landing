import { Recipe, RecipeIngredientWithDetails } from '../../types';

/**
 * Store recipe data in sessionStorage for COGS editor
 */
export function storeRecipeForEditing(
  recipe: Recipe,
  calculations: ReturnType<typeof import('./recipeCalculationHelpers').convertToCOGSCalculations>,
): void {
  sessionStorage.setItem(
    'editingRecipe',
    JSON.stringify({
      recipe,
      calculations,
      dishName: recipe.name,
      dishPortions: recipe.yield,
      dishNameLocked: true,
    }),
  );
}
