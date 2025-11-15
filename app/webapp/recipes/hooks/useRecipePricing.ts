'use client';

import { useCallback, useRef, useState } from 'react';
import { Recipe, RecipeIngredientWithDetails, RecipePriceData } from '../types';
import { calculateRecipePrice } from './utils/pricingHelpers';

export function useRecipePricing() {
  const [recipePrices, setRecipePrices] = useState<Record<string, RecipePriceData>>({});
  // Track in-flight requests to prevent duplicates and allow cancellation
  const inFlightRequestsRef = useRef<Map<string, AbortController>>(new Map());

  const calculateRecommendedPrice = useCallback(
    (recipe: Recipe, ingredients: RecipeIngredientWithDetails[]) => {
      return calculateRecipePrice(recipe, ingredients);
    },
    [],
  );

  // Calculate prices only for visible/paginated recipes
  const calculateVisibleRecipePrices = useCallback(
    async (
      visibleRecipes: Recipe[],
      fetchRecipeIngredients: (recipeId: string) => Promise<RecipeIngredientWithDetails[]>,
      fetchBatchRecipeIngredients?: (
        recipeIds: string[],
      ) => Promise<Record<string, RecipeIngredientWithDetails[]>>,
    ) => {
      const prices: Record<string, RecipePriceData> = {};

      if (visibleRecipes.length === 0) {
        return prices;
      }

      // Cancel any in-flight requests for recipes we're about to recalculate
      visibleRecipes.forEach(recipe => {
        const existingRequest = inFlightRequestsRef.current.get(recipe.id);
        if (existingRequest) {
          existingRequest.abort();
          inFlightRequestsRef.current.delete(recipe.id);
        }
      });

      // Try batch fetch first if available
      if (fetchBatchRecipeIngredients) {
        try {
          const recipeIds = visibleRecipes.map(r => r.id);
          console.log('[RecipePricing] Batch fetching ingredients for', recipeIds.length, 'recipes');

          // Mark recipes as in-flight (batch requests can't be cancelled, so we just track them)
          visibleRecipes.forEach(recipe => {
            // Only track if not already tracked (prevents duplicate requests)
            if (!inFlightRequestsRef.current.has(recipe.id)) {
              inFlightRequestsRef.current.set(recipe.id, new AbortController());
            }
          });

          const batchStartTime = Date.now();
          const batchIngredients = await fetchBatchRecipeIngredients(recipeIds);
          const batchDuration = Date.now() - batchStartTime;
          console.log('[RecipePricing] Batch fetch completed in', batchDuration, 'ms');

          if (Object.keys(batchIngredients).length > 0) {
            console.log('[RecipePricing] Calculating prices from batch data');
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
                console.error(`[RecipePricing] Failed to calculate price for recipe ${recipe.id}:`, err);
              }
            }
            const calcDuration = Date.now() - calcStartTime;
            console.log('[RecipePricing] Price calculation completed in', calcDuration, 'ms, calculated', calculatedCount, 'prices');
            // Clean up request tracking
            visibleRecipes.forEach(recipe => {
              inFlightRequestsRef.current.delete(recipe.id);
            });
            return prices;
          } else {
            console.warn('[RecipePricing] Batch fetch returned empty results, falling back to individual calls');
            // Clean up even if no results
            visibleRecipes.forEach(recipe => {
              inFlightRequestsRef.current.delete(recipe.id);
            });
          }
        } catch (err) {
          console.error('[RecipePricing] Batch fetch failed, falling back to parallel individual calls:', err);
          // Clean up on error
          visibleRecipes.forEach(recipe => {
            inFlightRequestsRef.current.delete(recipe.id);
          });
        }
      }
      // Fallback: parallel individual fetches
      try {
        console.log('[RecipePricing] Falling back to parallel individual fetches for', visibleRecipes.length, 'recipes');
        const fallbackStartTime = Date.now();
        const results = await Promise.all(
          visibleRecipes.map(async recipe => {
            const abortController = new AbortController();
            inFlightRequestsRef.current.set(recipe.id, abortController);

            try {
              const ingredients = await fetchRecipeIngredients(recipe.id);

              // Check if request was aborted
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
              console.error(`[RecipePricing] Failed to calculate price for recipe ${recipe.id}:`, err);
              return { recipeId: recipe.id, priceData: null };
            }
          }),
        );
        const fallbackDuration = Date.now() - fallbackStartTime;
        console.log('[RecipePricing] Parallel fetch completed in', fallbackDuration, 'ms');
        results.forEach(({ recipeId, priceData }) => {
          if (priceData) prices[recipeId] = priceData;
        });
        console.log('[RecipePricing] Calculated prices for', Object.keys(prices).length, 'recipes');
      } catch (err) {
        console.error('[RecipePricing] Failed to calculate recipe prices:', err);
      }

      return prices;
    },
    [calculateRecommendedPrice],
  );

  // Calculate prices for all recipes (kept for backward compatibility and full refresh)
  const calculateAllRecipePrices = useCallback(
    async (
      recipesData: Recipe[],
      fetchRecipeIngredients: (recipeId: string) => Promise<RecipeIngredientWithDetails[]>,
      fetchBatchRecipeIngredients?: (
        recipeIds: string[],
      ) => Promise<Record<string, RecipeIngredientWithDetails[]>>,
    ) => {
      const prices: Record<string, RecipePriceData> = {};

      if (recipesData.length === 0) {
        setRecipePrices(prices);
        return;
      }

      // Cancel all in-flight requests
      inFlightRequestsRef.current.forEach(controller => controller.abort());
      inFlightRequestsRef.current.clear();

      // Try batch fetch first if available
      if (fetchBatchRecipeIngredients) {
        try {
          const recipeIds = recipesData.map(r => r.id);
          const batchIngredients = await fetchBatchRecipeIngredients(recipeIds);
          if (Object.keys(batchIngredients).length > 0) {
            for (const recipe of recipesData) {
              try {
                const ingredients = batchIngredients[recipe.id] || [];
                const priceData = calculateRecommendedPrice(recipe, ingredients);
                if (priceData) prices[recipe.id] = priceData;
              } catch (err) {
                console.log(`Failed to calculate price for recipe ${recipe.id}:`, err);
              }
            }
            setRecipePrices(prices);
            return;
          }
        } catch (err) {
          console.log('Batch fetch failed, falling back to parallel individual calls:', err);
        }
      }
      // Fallback: parallel individual fetches
      try {
        const results = await Promise.all(
          recipesData.map(async recipe => {
            try {
              const ingredients = await fetchRecipeIngredients(recipe.id);
              const priceData = calculateRecommendedPrice(recipe, ingredients);
              return { recipeId: recipe.id, priceData };
            } catch (err) {
              console.log(`Failed to calculate price for recipe ${recipe.id}:`, err);
              return { recipeId: recipe.id, priceData: null };
            }
          }),
        );
        results.forEach(({ recipeId, priceData }) => {
          if (priceData) prices[recipeId] = priceData;
        });
      } catch (err) {
        console.error('Failed to calculate recipe prices:', err);
      }

      setRecipePrices(prices);
    },
    [calculateRecommendedPrice],
  );

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
        console.log('Failed to refresh recipe prices:', err);
      }
    },
    [calculateAllRecipePrices],
  );

  // Update prices for visible recipes incrementally
  const updateVisibleRecipePrices = useCallback(
    async (
      visibleRecipes: Recipe[],
      fetchRecipeIngredients: (recipeId: string) => Promise<RecipeIngredientWithDetails[]>,
      fetchBatchRecipeIngredients?: (
        recipeIds: string[],
      ) => Promise<Record<string, RecipeIngredientWithDetails[]>>,
    ) => {
      const startTime = Date.now();
      const newPrices = await calculateVisibleRecipePrices(
        visibleRecipes,
        fetchRecipeIngredients,
        fetchBatchRecipeIngredients,
      );
      const duration = Date.now() - startTime;
      console.log('[RecipePricing] updateVisibleRecipePrices completed in', duration, 'ms, updating', Object.keys(newPrices).length, 'prices');
      setRecipePrices(prev => {
        const updated = { ...prev, ...newPrices };
        console.log('[RecipePricing] Total prices in state:', Object.keys(updated).length);
        return updated;
      });
    },
    [calculateVisibleRecipePrices],
  );

  return {
    recipePrices,
    calculateRecommendedPrice,
    calculateAllRecipePrices,
    calculateVisibleRecipePrices,
    updateVisibleRecipePrices,
    refreshRecipePrices,
  };
}
