import { logger } from '@/lib/logger';
import { Recipe } from '../../../types';
import { handleAddRecipe as handleAddRecipeHelper } from './handleAddRecipe';

export function createHandleAddRecipe(
  recipes: Recipe[],
  optimisticallyUpdateRecipes: (updater: (recipes: Recipe[]) => Recipe[]) => void,
  onRecipeCreated: () => void,
  showErrorNotification: (message: string) => void,
  showSuccess: (message: string) => void,
) {
  return async (newRecipe: Partial<Recipe>) => {
    try {
      return await handleAddRecipeHelper({
        newRecipe,
        recipes,
        optimisticallyUpdateRecipes,
        onRecipeCreated,
        showErrorNotification,
        showSuccess,
      });
    } catch (err) {
      logger.error('[createHandleAddRecipe] Error in catch block:', {
        error: err instanceof Error ? err.message : String(err),
      });
      // Rollback handled in handleAddRecipeHelper
      showErrorNotification('Failed to add recipe');
      return false;
    }
  };
}
