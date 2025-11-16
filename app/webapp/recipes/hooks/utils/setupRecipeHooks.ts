import { Recipe } from '../../types';
import { RecipeError } from '../../types/errors';
import { RecipePriceData } from '../../types';
import { useRecipeIngredients } from '../useRecipeIngredients';
import { useRecipePricing } from '../useRecipePricing';
import { setupRecipeSubscriptions } from './setupRecipeSubscriptions';
import { useRecipeInitialization } from './useRecipeInitialization';

/**
 * Setup all recipe-related hooks and subscriptions.
 *
 * @param {Object} params - Hook setup parameters
 * @returns {Object} Hook return values
 */
export function setupRecipeHooks({
  setError,
  setRecipes,
  setIsHydrated,
  pricesCalculatedRef,
  updateVisibleRecipePrices,
  fetchRecipeIngredients,
  fetchBatchRecipeIngredients,
  recipes,
  refreshRecipePrices,
  onIngredientsChange,
  fetchRecipes,
}: {
  setError: (error: string | null) => void;
  setRecipes: (recipes: Recipe[]) => void;
  setIsHydrated: (hydrated: boolean) => void;
  pricesCalculatedRef: React.MutableRefObject<Set<string>>;
  updateVisibleRecipePrices: (
    recipes: Recipe[],
    fetchRecipeIngredients: (recipeId: string) => Promise<any[]>,
    fetchBatchRecipeIngredients?: (recipeIds: string[]) => Promise<Record<string, any[]>>,
  ) => Promise<void>;
  fetchRecipeIngredients: (recipeId: string) => Promise<any[]>;
  fetchBatchRecipeIngredients: (recipeIds: string[]) => Promise<Record<string, any[]>>;
  recipes: Recipe[];
  refreshRecipePrices: (
    recipes: Recipe[],
    fetchRecipeIngredients: any,
    fetchBatchRecipeIngredients?: any,
  ) => Promise<void>;
  onIngredientsChange?: (recipeId: string) => void;
  fetchRecipes: () => Promise<void>;
}) {
  const {
    recipePrices,
    calculateRecommendedPrice,
    calculateAllRecipePrices,
    calculateVisibleRecipePrices,
    refreshRecipePrices: refreshPrices,
  } = useRecipePricing();

  setupRecipeSubscriptions({
    recipes,
    refreshRecipePrices,
    fetchRecipeIngredients,
    fetchBatchRecipeIngredients,
    onIngredientsChange,
    fetchRecipes,
  });

  useRecipeInitialization({
    setRecipes,
    setIsHydrated,
    pricesCalculatedRef,
    updateVisibleRecipePrices,
    fetchRecipeIngredients,
    fetchBatchRecipeIngredients,
    fetchRecipes,
  });

  return {
    recipePrices,
    calculateRecommendedPrice,
    calculateAllRecipePrices,
    calculateVisibleRecipePrices,
    refreshRecipePrices: refreshPrices,
  };
}
