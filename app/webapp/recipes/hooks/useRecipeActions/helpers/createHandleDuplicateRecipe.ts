import { logger } from '@/lib/logger';
import { Recipe, RecipeIngredientWithDetails } from '@/lib/types/recipes';
import { handleDuplicateRecipe as handleDuplicateRecipeHelper } from './handleDuplicateRecipe';

export function createHandleDuplicateRecipe(
  recipes: Recipe[],
  fetchRecipeIngredients: (recipeId: string) => Promise<RecipeIngredientWithDetails[]>,
  optimisticallyUpdateRecipes: (updater: (recipes: Recipe[]) => Recipe[]) => void,
  showErrorNotification: (message: string) => void,
  showSuccess: (message: string) => void,
) {
  return async (recipe: Recipe) => {
    try {
      return await handleDuplicateRecipeHelper({
        recipe,
        recipes,
        fetchRecipeIngredients,
        optimisticallyUpdateRecipes,
        showErrorNotification,
        showSuccess,
      });
    } catch (err) {
      logger.error('Error duplicating recipe:', err);
      // Rollback handled in handleDuplicateRecipeHelper
      showErrorNotification('Failed to duplicate recipe');
      return null;
    }
  };
}
