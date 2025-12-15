/**
 * Create pricing calculation callbacks.
 */
import type { Recipe, RecipeIngredientWithDetails, RecipePriceData } from '../../../types';
import { calculateAllPrices } from '../calculateAllPrices';
import { calculateVisiblePrices } from '../calculateVisiblePrices';
import { updateVisiblePricesWithDebounce } from '../updateVisiblePricesWithDebounce';
import { fetchBatchWithDeduplication } from '../fetchBatchWithDeduplication';

export function createPricingCallbacksHelper(
  calculateRecommendedPrice: (recipe: Recipe, ingredients: RecipeIngredientWithDetails[]) => RecipePriceData | null,
  inFlightRequestsRef: React.MutableRefObject<Map<string, AbortController>>,
  batchRequestCacheRef: React.MutableRefObject<Map<string, Promise<Record<string, RecipeIngredientWithDetails[]>>>>,
  setRecipePrices: (prices: Record<string, RecipePriceData> | ((prev: Record<string, RecipePriceData>) => Record<string, RecipePriceData>)) => void,
  debounceTimerRef: React.MutableRefObject<NodeJS.Timeout | null>,
) {
  const fetchBatchWrapper = (recipeIds: string[], fetchBatch: (recipeIds: string[]) => Promise<Record<string, RecipeIngredientWithDetails[]>>) => fetchBatchWithDeduplication({ recipeIds, fetchBatchRecipeIngredients: fetchBatch, batchRequestCacheRef });
  const calculateVisibleRecipePrices = async (visibleRecipes: Recipe[], fetchRecipeIngredients: (recipeId: string) => Promise<RecipeIngredientWithDetails[]>, fetchBatchRecipeIngredients?: (recipeIds: string[]) => Promise<Record<string, RecipeIngredientWithDetails[]>>) => calculateVisiblePrices({ visibleRecipes, fetchRecipeIngredients, fetchBatchRecipeIngredients, inFlightRequestsRef, calculateRecommendedPrice, fetchBatchWithDeduplication: fetchBatchWrapper });
  const calculateAllRecipePrices = async (recipesData: Recipe[], fetchRecipeIngredients: (recipeId: string) => Promise<RecipeIngredientWithDetails[]>, fetchBatchRecipeIngredients?: (recipeIds: string[]) => Promise<Record<string, RecipeIngredientWithDetails[]>>) => {
    if (recipesData.length === 0) { setRecipePrices({}); return; }
    inFlightRequestsRef.current.forEach(controller => controller.abort());
    inFlightRequestsRef.current.clear();
    const prices = await calculateAllPrices({ recipesData, fetchRecipeIngredients, fetchBatchRecipeIngredients, calculateRecommendedPrice, fetchBatchWithDeduplication: fetchBatchWrapper });
    setRecipePrices(prices);
  };
  const updateVisibleRecipePrices = async (visibleRecipes: Recipe[], fetchRecipeIngredients: (recipeId: string) => Promise<RecipeIngredientWithDetails[]>, fetchBatchRecipeIngredients?: (recipeIds: string[]) => Promise<Record<string, RecipeIngredientWithDetails[]>>) => updateVisiblePricesWithDebounce({ visibleRecipes, fetchRecipeIngredients, fetchBatchRecipeIngredients, calculateVisibleRecipePrices, setRecipePrices, debounceTimerRef });
  return { calculateVisibleRecipePrices, calculateAllRecipePrices, updateVisibleRecipePrices };
}
