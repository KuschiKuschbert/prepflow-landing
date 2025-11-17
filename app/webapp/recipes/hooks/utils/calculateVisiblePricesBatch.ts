import { logger } from '@/lib/logger';
import { Recipe, RecipeIngredientWithDetails, RecipePriceData } from '../../types';
/**
 * Calculate prices using batch fetch.
 * @param {Object} params - Batch calculation parameters
 * @returns {Promise<Record<string, RecipePriceData> | null>} Prices or null if batch fails
 */
export async function calculateVisiblePricesBatch({
  visibleRecipes,
  fetchBatchWithDeduplication,
  fetchBatchRecipeIngredients,
  inFlightRequestsRef,
  calculateRecommendedPrice,
}: {
  visibleRecipes: Recipe[];
  fetchBatchWithDeduplication: (
    recipeIds: string[],
    fetchBatchRecipeIngredients: (
      recipeIds: string[],
    ) => Promise<Record<string, RecipeIngredientWithDetails[]>>,
  ) => Promise<Record<string, RecipeIngredientWithDetails[]>>;
  fetchBatchRecipeIngredients: (
    recipeIds: string[],
  ) => Promise<Record<string, RecipeIngredientWithDetails[]>>;
  inFlightRequestsRef: React.MutableRefObject<Map<string, AbortController>>;
  calculateRecommendedPrice: (
    recipe: Recipe,
    ingredients: RecipeIngredientWithDetails[],
  ) => RecipePriceData | null;
}): Promise<Record<string, RecipePriceData> | null> {
  const prices: Record<string, RecipePriceData> = {};
  const recipeIds = visibleRecipes.map(r => r.id);
  logger.dev(`[RecipePricing] Batch fetching ingredients for ${recipeIds.length} recipes`);

  visibleRecipes.forEach(recipe => {
    if (!inFlightRequestsRef.current.has(recipe.id)) {
      inFlightRequestsRef.current.set(recipe.id, new AbortController());
    }
  });

  try {
    const batchStartTime = Date.now();
    const batchIngredients = await fetchBatchWithDeduplication(
      recipeIds,
      fetchBatchRecipeIngredients,
    );
    const batchDuration = Date.now() - batchStartTime;
    logger.dev(`[RecipePricing] Batch fetch completed in ${batchDuration}ms`);

    if (Object.keys(batchIngredients).length > 0) {
      logger.dev('[RecipePricing] Calculating prices from batch data');
      const calcStartTime = Date.now();
      let calculatedCount = 0;
      for (const recipe of visibleRecipes) {
        try {
          const ingredients = batchIngredients[recipe.id] || [];
          const priceData = calculateRecommendedPrice(recipe, ingredients);
          if (priceData) {
            prices[recipe.id] = priceData;
            calculatedCount++;
          }
        } catch (err) {
          logger.error(`[RecipePricing] Failed to calculate price for recipe ${recipe.id}:`, { error: err instanceof Error ? err.message : String(err) });
        }
      }
      const calcDuration = Date.now() - calcStartTime;
      logger.dev(`[RecipePricing] Price calculation completed in ${calcDuration}ms, calculated ${calculatedCount} prices`);
      visibleRecipes.forEach(recipe => {
        inFlightRequestsRef.current.delete(recipe.id);
      });
      return prices;
    } else {
      logger.warn(
        '[RecipePricing] Batch fetch returned empty results, falling back to individual calls',
      );
      visibleRecipes.forEach(recipe => {
        inFlightRequestsRef.current.delete(recipe.id);
      });
      return null;
    }
  } catch (err) {
    logger.error('[RecipePricing] Batch fetch failed, falling back to parallel individual calls:', { error: err instanceof Error ? err.message : String(err) });
    visibleRecipes.forEach(recipe => {
      inFlightRequestsRef.current.delete(recipe.id);
    });
    return null;
  }
}
