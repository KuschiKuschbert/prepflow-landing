import { cacheRecipes } from '@/lib/cache/recipe-cache';
import { categorizeError, retryWithBackoff, RecipeError } from '../../types/errors';
import { Recipe, RecipeIngredientWithDetails } from '../../types';
import { precalculatePrices } from './precalculatePrices';
import { logger } from '@/lib/logger';

/**
 * Fetch recipes with error handling and caching.
 *
 * @param {Function} setLoading - State setter for loading
 * @param {Function} setError - State setter for error
 * @param {Function} setRecipeError - State setter for recipe error
 * @param {Function} setRecipes - State setter for recipes
 * @param {Function} setIsHydrated - State setter for hydration flag
 * @param {Function} updateVisibleRecipePrices - Function to update visible recipe prices
 * @param {Function} fetchRecipeIngredients - Function to fetch recipe ingredients
 * @param {Function} fetchBatchRecipeIngredients - Function to fetch batch recipe ingredients
 * @param {React.MutableRefObject<Set<string>>} pricesCalculatedRef - Ref tracking calculated prices
 * @returns {Promise<void>}
 */
export async function fetchRecipesWithErrorHandling(
  setLoading: (loading: boolean) => void,
  setError: (error: string | null) => void,
  setRecipeError: (error: RecipeError | null) => void,
  setRecipes: (recipes: Recipe[]) => void,
  setIsHydrated: (hydrated: boolean) => void,
  updateVisibleRecipePrices: (
    recipes: Recipe[],
    fetchRecipeIngredients: (recipeId: string) => Promise<RecipeIngredientWithDetails[]>,
    fetchBatchRecipeIngredients?: (
      recipeIds: string[],
    ) => Promise<Record<string, RecipeIngredientWithDetails[]>>,
  ) => Promise<void>,
  fetchRecipeIngredients: (recipeId: string) => Promise<RecipeIngredientWithDetails[]>,
  fetchBatchRecipeIngredients: (
    recipeIds: string[],
  ) => Promise<Record<string, RecipeIngredientWithDetails[]>>,
  pricesCalculatedRef: React.MutableRefObject<Set<string>>,
): Promise<void> {
  setLoading(true);
  setError(null);
  setRecipeError(null);

  try {
    await retryWithBackoff(async () => {
      const response = await fetch('/api/recipes', { cache: 'no-store' });
      const result = await response.json();
      if (!response.ok) {
        const categorized = categorizeError(
          new Error(result.error || 'Failed to fetch recipes'),
          async () => {},
        );
        setRecipeError(categorized);
        setError(categorized.message);
        setLoading(false);
        throw categorized;
      } else {
        const recipesList = result.recipes || [];
        cacheRecipes(recipesList);
        setRecipes(recipesList);
        setLoading(false);
        setIsHydrated(true);
        // Pre-calculate prices for first page
        precalculatePrices(
          recipesList,
          pricesCalculatedRef,
          updateVisibleRecipePrices,
          fetchRecipeIngredients,
          fetchBatchRecipeIngredients,
        );
      }
    });
  } catch (err) {
    logger.error('[fetchRecipesWithErrorHandling.ts] Error in catch block:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    });

    const categorized = categorizeError(err, async () => {});
    setRecipeError(categorized);
    setError(categorized.message);
    setLoading(false);
  }
}
