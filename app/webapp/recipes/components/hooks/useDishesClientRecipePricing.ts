import { useEffect, useMemo, useRef } from 'react';
import { Recipe, RecipePriceData } from '../../types';

import { logger } from '@/lib/logger';
interface UseDishesClientRecipePricingProps {
  paginatedRecipesList: Recipe[];
  recipePrices: Record<string, RecipePriceData>;
  updateVisibleRecipePrices: (
    recipes: Recipe[],
    fetchRecipeIngredients: (recipeId: string) => Promise<any>,
    fetchBatchRecipeIngredients: (recipeIds: string[]) => Promise<any>,
  ) => Promise<void>;
  fetchRecipeIngredients: (recipeId: string) => Promise<any>;
  fetchBatchRecipeIngredients: (recipeIds: string[]) => Promise<any>;
}

export function useDishesClientRecipePricing({
  paginatedRecipesList,
  recipePrices,
  updateVisibleRecipePrices,
  fetchRecipeIngredients,
  fetchBatchRecipeIngredients,
}: UseDishesClientRecipePricingProps) {
  const calculatingPricesRef = useRef<Set<string>>(new Set());
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Create stable reference to recipe IDs for dependency tracking
  const paginatedRecipeIds = useMemo(
    () =>
      paginatedRecipesList
        .map(r => r.id)
        .sort()
        .join(','),
    [paginatedRecipesList],
  );

  useEffect(() => {
    if (paginatedRecipesList.length === 0) return;

    // Clear any existing debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Debounce price calculation by 300ms to prevent rapid-fire calls
    debounceTimerRef.current = setTimeout(() => {
      const recipesNeedingPrices = paginatedRecipesList.filter(
        recipe => !recipePrices[recipe.id] && !calculatingPricesRef.current.has(recipe.id),
      );

      if (recipesNeedingPrices.length > 0) {
        recipesNeedingPrices.forEach(recipe => {
          calculatingPricesRef.current.add(recipe.id);
        });

        updateVisibleRecipePrices(
          recipesNeedingPrices,
          fetchRecipeIngredients,
          fetchBatchRecipeIngredients,
        )
          .then(() => {
            recipesNeedingPrices.forEach(recipe => {
              calculatingPricesRef.current.delete(recipe.id);
            });
          })
          .catch(err => {
            logger.error('Failed to calculate visible recipe prices:', err);
            recipesNeedingPrices.forEach(recipe => {
              calculatingPricesRef.current.delete(recipe.id);
            });
          });
      }
    }, 300);

    // Cleanup debounce timer on unmount or dependency change
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
    };
    // Only depend on paginatedRecipeIds - don't retrigger when recipePrices changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginatedRecipeIds]);
}
