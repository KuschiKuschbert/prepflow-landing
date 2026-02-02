import { Recipe, RecipeIngredientWithDetails } from '@/lib/types/recipes';
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
    fetchRecipeIngredients: (recipeId: string) => Promise<RecipeIngredientWithDetails[]>,
    fetchBatchRecipeIngredients?: (
      recipeIds: string[],
    ) => Promise<Record<string, RecipeIngredientWithDetails[]>>,
  ) => Promise<void>;
  fetchRecipeIngredients: (recipeId: string) => Promise<RecipeIngredientWithDetails[]>;
  fetchBatchRecipeIngredients: (
    recipeIds: string[],
  ) => Promise<Record<string, RecipeIngredientWithDetails[]>>;
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
