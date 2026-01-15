import { useCallback, useRef } from 'react';
import { Recipe, RecipeIngredientWithDetails } from '../../types';

import { logger } from '@/lib/logger';
/**
 * Hook to manage price calculation for visible recipes.
 *
 * @param {Object} params - Price calculation parameters
 */
export function usePriceCalculation({
  paginatedRecipes,
  recipePrices,
  updateVisibleRecipePrices,
  fetchRecipeIngredients,
  fetchBatchRecipeIngredients,
}: {
  paginatedRecipes: Recipe[];
  recipePrices: Record<string, any>;
  updateVisibleRecipePrices: (
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
}): void {
  const calculatingPricesRef = useRef<Set<string>>(new Set());
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const paginatedRecipeIds = paginatedRecipes
    .map(r => r.id)
    .sort()
    .join(',');

  // Calculate prices for visible recipes only (lazy loading)
  useCallback(() => {
    if (paginatedRecipes.length === 0) return;

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      const recipesNeedingPrices = paginatedRecipes.filter(
        recipe => !recipePrices[recipe.id] && !calculatingPricesRef.current.has(recipe.id),
      );

      if (recipesNeedingPrices.length > 0) {
        recipesNeedingPrices.forEach(recipe => {
          calculatingPricesRef.current.add(recipe.id);
        });

        logger.dev(`[RecipesClient] Calculating prices for ${recipesNeedingPrices.length} recipes`);
        updateVisibleRecipePrices(
          recipesNeedingPrices,
          fetchRecipeIngredients,
          fetchBatchRecipeIngredients,
        )
          .then(() => {
            logger.dev('[RecipesClient] Price calculation completed');
            recipesNeedingPrices.forEach(recipe => {
              calculatingPricesRef.current.delete(recipe.id);
            });
          })
          .catch(err => {
            logger.error('[RecipesClient] Failed to calculate visible recipe prices:', err);
            recipesNeedingPrices.forEach(recipe => {
              calculatingPricesRef.current.delete(recipe.id);
            });
          });
      }
    }, 300);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginatedRecipeIds]);
}
