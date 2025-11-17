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
      recipeId: recipe.id,
      calculations,
      dishName: recipe.recipe_name,
      dishPortions: recipe.yield,
      dishNameLocked: true,
    }),
  );
}
