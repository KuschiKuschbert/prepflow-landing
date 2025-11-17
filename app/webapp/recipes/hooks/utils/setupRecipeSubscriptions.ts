import { Recipe } from '../../types';
import { RecipePriceData } from '../../types';
import { useRecipeSubscriptions } from '../useRecipeSubscriptions';

/**
 * Setup recipe subscriptions for real-time updates.
 *
 * @param {Object} params - Subscription parameters
 */
export function useSetupRecipeSubscriptions({
  recipes,
  refreshRecipePrices,
  fetchRecipeIngredients,
  fetchBatchRecipeIngredients,
  onIngredientsChange,
  fetchRecipes,
}: {
  recipes: Recipe[];
  refreshRecipePrices: (
    recipes: Recipe[],
    fetchRecipeIngredients: any,
    fetchBatchRecipeIngredients?: any,
  ) => Promise<void>;
  fetchRecipeIngredients: (recipeId: string) => Promise<any[]>;
  fetchBatchRecipeIngredients: (recipeIds: string[]) => Promise<Record<string, any[]>>;
  onIngredientsChange?: (recipeId: string) => void;
  fetchRecipes: () => Promise<void>;
}): void {
  useRecipeSubscriptions({
    recipes,
    refreshRecipePrices,
    fetchRecipeIngredients,
    fetchBatchRecipeIngredients,
    onIngredientsChange,
    onRecipeUpdated: () => {},
    fetchRecipes,
  });
}
