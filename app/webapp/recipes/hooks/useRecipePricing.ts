'use client';

import { useCallback, useRef, useState } from 'react';
import { Recipe, RecipeIngredientWithDetails, RecipePriceData } from '../types';
import { calculateRecipePrice } from './utils/pricingHelpers';
import { buildPricingCallbacks } from './utils/buildPricingCallbacks';
import { buildPricingReturn } from './utils/buildPricingReturn';

import { logger } from '@/lib/logger';
export function useRecipePricing() {
  const [recipePrices, setRecipePrices] = useState<Record<string, RecipePriceData>>({});
  const inFlightRequestsRef = useRef<Map<string, AbortController>>(new Map());
  const batchRequestCacheRef = useRef<
    Map<string, Promise<Record<string, RecipeIngredientWithDetails[]>>>
  >(new Map());
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const calculateRecommendedPrice = useCallback(
    (recipe: Recipe, ingredients: RecipeIngredientWithDetails[]) => {
      return calculateRecipePrice(recipe, ingredients);
    },
    [],
  );

  const { calculateVisibleRecipePrices, calculateAllRecipePrices, updateVisibleRecipePrices } =
    buildPricingCallbacks({
      calculateRecommendedPrice,
      inFlightRequestsRef,
      batchRequestCacheRef,
      setRecipePrices,
      debounceTimerRef,
    });

  const refreshRecipePrices = useCallback(
    async (
      recipes: Recipe[],
      fetchRecipeIngredients: (recipeId: string) => Promise<RecipeIngredientWithDetails[]>,
      fetchBatchRecipeIngredients?: (
        recipeIds: string[],
      ) => Promise<Record<string, RecipeIngredientWithDetails[]>>,
    ) => {
      if (recipes.length === 0) return;
      try {
        await calculateAllRecipePrices(
          recipes,
          fetchRecipeIngredients,
          fetchBatchRecipeIngredients,
        );
      } catch (err) {
        logger.dev('Failed to refresh recipe prices:', err);
      }
    },
    [calculateAllRecipePrices],
  );

  return buildPricingReturn({
    recipePrices,
    calculateRecommendedPrice,
    calculateAllRecipePrices,
    calculateVisibleRecipePrices,
    updateVisibleRecipePrices,
    refreshRecipePrices,
  });
}
