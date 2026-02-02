'use client';

import { useCallback } from 'react';
import { COGSCalculation, RecipeIngredient } from '@/lib/types/cogs';
import { mergeCalculations, mergeRecipeIngredients } from './utils/mergeCalculations';
import { logger } from '@/lib/logger';
import {
  mapApiItemsToCalculations,
  mapApiItemsToRecipeIngredients,
} from './utils/mapApiItemsToCalculations';

interface UseRecipeIngredientLoadingProps {
  setCalculations: React.Dispatch<React.SetStateAction<COGSCalculation[]>>;
  setRecipeIngredients: React.Dispatch<React.SetStateAction<RecipeIngredient[]>>;
  setError?: (error: string) => void;
  setIsLoadingFromApi?: (loading: boolean) => void;
  preserveManualIngredients?: () => boolean;
}

export function useRecipeIngredientLoading({
  setCalculations,
  setRecipeIngredients,
  setError,
  setIsLoadingFromApi,
  preserveManualIngredients = () => false,
}: UseRecipeIngredientLoadingProps) {
  const loadExistingRecipeIngredients = useCallback(
    async (recipeId: string) => {
      if (!recipeId) return;

      try {
        const response = await fetch(`/api/recipes/${recipeId}/ingredients`, {
          cache: 'no-store',
        });
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
          if (setError)
            setError(errorData.error || `Failed to fetch ingredients: ${response.status}`);
          return;
        }
        const result = await response.json();
        const items = result.items || [];
        if (items.length === 0) {
          setCalculations([]);
          setRecipeIngredients([]);
          return;
        }
        const loadedCalculations = mapApiItemsToCalculations(items, recipeId);
        const recipeIngredients = mapApiItemsToRecipeIngredients(items, recipeId);
        if (setIsLoadingFromApi) setIsLoadingFromApi(true);
        // Call function at runtime to check if manual ingredients should be preserved
        const shouldPreserve = preserveManualIngredients();
        if (shouldPreserve) {
          setCalculations(prev => mergeCalculations(prev, loadedCalculations));
          setRecipeIngredients(prev => mergeRecipeIngredients(prev, recipeIngredients));
        } else {
          setCalculations(loadedCalculations);
          Promise.resolve().then(() => {
            setRecipeIngredients(recipeIngredients);
          });
        }
        Promise.resolve().then(() => {
          if (setIsLoadingFromApi) setIsLoadingFromApi(false);
        });
      } catch (err) {
        logger.error('[useRecipeIngredientLoading.ts] Error in catch block:', {
          error: err instanceof Error ? err.message : String(err),
          stack: err instanceof Error ? err.stack : undefined,
        });

        if (setError)
          setError(err instanceof Error ? err.message : 'Failed to load recipe ingredients');
      }
    },
    [
      setCalculations,
      setRecipeIngredients,
      setError,
      setIsLoadingFromApi,
      preserveManualIngredients,
    ],
  );
  return { loadExistingRecipeIngredients };
}
