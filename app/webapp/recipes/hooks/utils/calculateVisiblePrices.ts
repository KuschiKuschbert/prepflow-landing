import { Recipe, RecipeIngredientWithDetails, RecipePriceData } from '../../types';
import { calculateVisiblePricesBatch } from './calculateVisiblePricesBatch';
import { calculateVisiblePricesFallback } from './calculateVisiblePricesFallback';

/**
 * Calculate prices for visible recipes using batch fetch or fallback to parallel individual fetches.
 *
 * @param {Object} params - Calculation parameters
 * @returns {Promise<Record<string, RecipePriceData>>} Prices by recipe ID
 */
export async function calculateVisiblePrices({
  visibleRecipes,
  fetchRecipeIngredients,
  fetchBatchRecipeIngredients,
  inFlightRequestsRef,
  calculateRecommendedPrice,
  fetchBatchWithDeduplication,
}: {
  visibleRecipes: Recipe[];
  fetchRecipeIngredients: (recipeId: string) => Promise<RecipeIngredientWithDetails[]>;
  fetchBatchRecipeIngredients?: (
    recipeIds: string[],
  ) => Promise<Record<string, RecipeIngredientWithDetails[]>>;
  inFlightRequestsRef: React.MutableRefObject<Map<string, AbortController>>;
  calculateRecommendedPrice: (
    recipe: Recipe,
    ingredients: RecipeIngredientWithDetails[],
  ) => RecipePriceData | null;
  fetchBatchWithDeduplication: (
    recipeIds: string[],
    fetchBatchRecipeIngredients: (
      recipeIds: string[],
    ) => Promise<Record<string, RecipeIngredientWithDetails[]>>,
  ) => Promise<Record<string, RecipeIngredientWithDetails[]>>;
}): Promise<Record<string, RecipePriceData>> {
  const prices: Record<string, RecipePriceData> = {};

  if (visibleRecipes.length === 0) {
    return prices;
  }

  visibleRecipes.forEach(recipe => {
    const existingRequest = inFlightRequestsRef.current.get(recipe.id);
    if (existingRequest) {
      existingRequest.abort();
      inFlightRequestsRef.current.delete(recipe.id);
    }
  });

  if (fetchBatchRecipeIngredients) {
    const batchPrices = await calculateVisiblePricesBatch({
      visibleRecipes,
      fetchBatchWithDeduplication,
      fetchBatchRecipeIngredients,
      inFlightRequestsRef,
      calculateRecommendedPrice,
    });
    if (batchPrices) {
      return batchPrices;
    }
  }

  return await calculateVisiblePricesFallback({
    visibleRecipes,
    fetchRecipeIngredients,
    inFlightRequestsRef,
    calculateRecommendedPrice,
  });
}
