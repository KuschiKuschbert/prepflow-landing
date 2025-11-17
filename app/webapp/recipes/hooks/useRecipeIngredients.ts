'use client';

import { useCallback, useRef } from 'react';
import { RecipeIngredientWithDetails } from '../types';
import { batchFetchWithRetry } from './utils/batchFetchWithRetry';
import { logger } from '@/lib/logger';
import {
  globalBatchRequestCache,
  globalRequestQueue,
  isProcessingQueue,
  normalizeRecipeIds,
  processBatchRequestQueue,
} from './utils/batchRequestQueue';
import { fetchFromClientJoin } from './utils/fetchFromClientJoin';
import { fetchWithRetry } from './utils/fetchWithRetry';

export function useRecipeIngredients(setError: (error: string) => void) {
  const fetchFromApiRef = useRef<
    | ((recipeId: string, retryCount?: number) => Promise<RecipeIngredientWithDetails[] | null>)
    | null
  >(null);
  const fetchFromApi = useCallback(
    async (recipeId: string, retryCount = 0): Promise<RecipeIngredientWithDetails[] | null> => {
      return fetchWithRetry(recipeId, retryCount, fetchFromApiRef);
    },
    [],
  );

  fetchFromApiRef.current = fetchFromApi;

  const fetchFromClientJoinCallback = useCallback(
    async (recipeId: string): Promise<RecipeIngredientWithDetails[]> => {
      return fetchFromClientJoin(recipeId, setError);
    },
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
      if (recipeIds.length === 0) return {};
      const cacheKey = normalizeRecipeIds(recipeIds);
      const cachedPromise = globalBatchRequestCache.get(cacheKey);
      if (cachedPromise) return cachedPromise;
      if (isProcessingQueue || globalRequestQueue.length > 0) {
        return new Promise<Record<string, RecipeIngredientWithDetails[]>>((resolve, reject) => {
          globalRequestQueue.push({ recipeIds, resolve, reject });
          if (!isProcessingQueue) {
            processBatchRequestQueue(performBatchFetch).catch(err =>
              logger.error('[RecipeIngredients] Queue processing error:', err),
            );
          }
        });
      }

      const batchPromise = performBatchFetch(recipeIds)
        .then(result => {
          globalBatchRequestCache.delete(cacheKey);
          processBatchRequestQueue(performBatchFetch).catch(err =>
            logger.error('[RecipeIngredients] Queue processing error:', err),
          );
          return result;
        })
        .catch(err => {
          globalBatchRequestCache.delete(cacheKey);
          processBatchRequestQueue(performBatchFetch).catch(processErr =>
            logger.error('[RecipeIngredients] Queue processing error:', processErr),
          );
          throw err;
        });

      globalBatchRequestCache.set(cacheKey, batchPromise);
      return batchPromise;
    },
    [performBatchFetch],
  );

  return { fetchRecipeIngredients, fetchBatchRecipeIngredients };
}
