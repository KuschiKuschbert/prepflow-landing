import { useEffect, useRef } from 'react';
import { Recipe, RecipeIngredientWithDetails } from '@/lib/types/recipes';

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
  recipePrices: Record<string, unknown>;
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

  useEffect(() => {
    if (paginatedRecipes.length === 0) return;

    const runCalculation = () => {
      const recipesNeedingPrices = paginatedRecipes.filter(
        recipe => !recipePrices[recipe.id] && !calculatingPricesRef.current.has(recipe.id),
      );

      if (recipesNeedingPrices.length === 0) return;

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
        })
        .catch(err => {
          logger.error('[RecipesClient] Failed to calculate visible recipe prices:', err);
        })
        .finally(() => {
          recipesNeedingPrices.forEach(recipe => {
            calculatingPricesRef.current.delete(recipe.id);
          });
        });
    };

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(runCalculation, 300);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginatedRecipeIds, paginatedRecipes, recipePrices]); // Added proper dependencies
}
