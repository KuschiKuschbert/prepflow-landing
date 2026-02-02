'use client';
import { logger } from '@/lib/logger';
import { useCallback, useRef } from 'react';
import { RecipeIngredientWithDetails } from '@/lib/types/recipes';
import { manageBatchRequest } from './utils/batch-manager';
import { batchFetchWithRetry } from './utils/batchFetchWithRetry';
import { fetchFromClientJoin } from './utils/fetchFromClientJoin';
import { fetchWithRetry } from './utils/fetchWithRetry';

export function useRecipeIngredients(setError: (error: string) => void) {
  const fetchFromApiRef = useRef<
    | ((recipeId: string, retryCount?: number) => Promise<RecipeIngredientWithDetails[] | null>)
    | null
  >(null);
  const fetchFromApi = useCallback(
    async (recipeId: string, retryCount = 0): Promise<RecipeIngredientWithDetails[] | null> =>
      fetchWithRetry(recipeId, retryCount, fetchFromApiRef),
    [],
  );

  fetchFromApiRef.current = fetchFromApi;
  const fetchFromClientJoinCallback = useCallback(
    async (recipeId: string): Promise<RecipeIngredientWithDetails[]> =>
      fetchFromClientJoin(recipeId, setError),
    [setError],
  );
  const fetchRecipeIngredients = useCallback(
    async (recipeId: string): Promise<RecipeIngredientWithDetails[]> => {
      try {
        const fromApi = await fetchFromApi(recipeId);
        if (Array.isArray(fromApi) && fromApi.length > 0) return fromApi;
        return await fetchFromClientJoinCallback(recipeId);
      } catch (err) {
        logger.error('Exception fetching recipe ingredients:', err);
        setError('Failed to fetch recipe ingredients');
        return [];
      }
    },
    [fetchFromApi, fetchFromClientJoinCallback, setError],
  );
  const performBatchFetchRef = useRef<
    | ((
        recipeIds: string[],
        retryCount?: number,
      ) => Promise<Record<string, RecipeIngredientWithDetails[]>>)
    | null
  >(null);
  const performBatchFetch = useCallback(
    async (
      recipeIds: string[],
      retryCount = 0,
    ): Promise<Record<string, RecipeIngredientWithDetails[]>> => {
      return batchFetchWithRetry(recipeIds, retryCount, performBatchFetchRef);
    },
    [],
  );

  performBatchFetchRef.current = performBatchFetch;
  const fetchBatchRecipeIngredients = useCallback(
    async (recipeIds: string[]): Promise<Record<string, RecipeIngredientWithDetails[]>> => {
      return manageBatchRequest(recipeIds, performBatchFetch);
    },
    [performBatchFetch],
  );
  return { fetchRecipeIngredients, fetchBatchRecipeIngredients };
}
