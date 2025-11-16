import { Recipe, RecipeIngredientWithDetails, RecipePriceData } from '../../types';

/**
 * Update visible recipe prices with debouncing.
 *
 * @param {Object} params - Update parameters
 * @returns {Promise<void>}
 */
export function updateVisiblePricesWithDebounce({
  visibleRecipes,
  fetchRecipeIngredients,
  fetchBatchRecipeIngredients,
  calculateVisibleRecipePrices,
  setRecipePrices,
  debounceTimerRef,
}: {
  visibleRecipes: Recipe[];
  fetchRecipeIngredients: (recipeId: string) => Promise<RecipeIngredientWithDetails[]>;
  fetchBatchRecipeIngredients?: (
    recipeIds: string[],
  ) => Promise<Record<string, RecipeIngredientWithDetails[]>>;
  calculateVisibleRecipePrices: (
    visibleRecipes: Recipe[],
    fetchRecipeIngredients: (recipeId: string) => Promise<RecipeIngredientWithDetails[]>,
    fetchBatchRecipeIngredients?: (
      recipeIds: string[],
    ) => Promise<Record<string, RecipeIngredientWithDetails[]>>,
  ) => Promise<Record<string, RecipePriceData>>;
  setRecipePrices: (
    prices:
      | Record<string, RecipePriceData>
      | ((prev: Record<string, RecipePriceData>) => Record<string, RecipePriceData>),
  ) => void;
  debounceTimerRef: React.MutableRefObject<NodeJS.Timeout | null>;
}): Promise<void> {
  if (debounceTimerRef.current) {
    clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = null;
  }

  return new Promise<void>((resolve, reject) => {
    debounceTimerRef.current = setTimeout(async () => {
      try {
        const startTime = Date.now();
        const newPrices = await calculateVisibleRecipePrices(
          visibleRecipes,
          fetchRecipeIngredients,
          fetchBatchRecipeIngredients,
        );
        const duration = Date.now() - startTime;
        console.log(
          '[RecipePricing] updateVisibleRecipePrices completed in',
          duration,
          'ms, updating',
          Object.keys(newPrices).length,
          'prices',
        );
        setRecipePrices(prev => {
          const updated = { ...prev, ...newPrices };
          console.log('[RecipePricing] Total prices in state:', Object.keys(updated).length);
          return updated;
        });
        resolve();
      } catch (err) {
        reject(err);
      } finally {
        debounceTimerRef.current = null;
      }
    }, 50);
  });
}
