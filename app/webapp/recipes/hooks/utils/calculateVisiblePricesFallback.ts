import { Recipe, RecipeIngredientWithDetails, RecipePriceData } from '../../types';

import { logger } from '@/lib/logger';
/**
 * Calculate prices using parallel individual fetches as fallback.
 *
 * @param {Object} params - Fallback calculation parameters
 * @returns {Promise<Record<string, RecipePriceData>>} Prices by recipe ID
 */
export async function calculateVisiblePricesFallback({
  visibleRecipes,
  fetchRecipeIngredients,
  inFlightRequestsRef,
  calculateRecommendedPrice,
}: {
  visibleRecipes: Recipe[];
  fetchRecipeIngredients: (recipeId: string) => Promise<RecipeIngredientWithDetails[]>;
  inFlightRequestsRef: React.MutableRefObject<Map<string, AbortController>>;
  calculateRecommendedPrice: (
    recipe: Recipe,
    ingredients: RecipeIngredientWithDetails[],
  ) => RecipePriceData | null;
}): Promise<Record<string, RecipePriceData>> {
  const prices: Record<string, RecipePriceData> = {};
  logger.dev(
    `[RecipePricing] Falling back to parallel individual fetches for ${visibleRecipes.length} recipes`,
  );
  const fallbackStartTime = Date.now();

  try {
    const results = await Promise.all(
      visibleRecipes.map(async recipe => {
        const abortController = new AbortController();
        inFlightRequestsRef.current.set(recipe.id, abortController);

        try {
          const ingredients = await fetchRecipeIngredients(recipe.id);

          if (abortController.signal.aborted) {
            return { recipeId: recipe.id, priceData: null };
          }

          const priceData = calculateRecommendedPrice(recipe, ingredients);
          inFlightRequestsRef.current.delete(recipe.id);
          return { recipeId: recipe.id, priceData };
        } catch (err) {
          inFlightRequestsRef.current.delete(recipe.id);
          if (err instanceof Error && err.name === 'AbortError') {
            return { recipeId: recipe.id, priceData: null };
          }
          logger.error(`[RecipePricing] Failed to calculate price for recipe ${recipe.id}:`, {
            error: err instanceof Error ? err.message : String(err),
          });
          return { recipeId: recipe.id, priceData: null };
        }
      }),
    );
    const fallbackDuration = Date.now() - fallbackStartTime;
    logger.dev(`[RecipePricing] Parallel fetch completed in ${fallbackDuration}ms`);
    results.forEach(({ recipeId, priceData }) => {
      if (priceData) prices[recipeId] = priceData;
    });
    logger.dev(`[RecipePricing] Calculated prices for ${Object.keys(prices).length} recipes`);
  } catch (err) {
    logger.error('[RecipePricing] Failed to calculate recipe prices:', {
      error: err instanceof Error ? err.message : String(err),
    });
  }

  return prices;
}
