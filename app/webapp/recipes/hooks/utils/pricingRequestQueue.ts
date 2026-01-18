import { RecipeIngredientWithDetails } from '../../types';
import { logger } from '@/lib/logger';

interface QueuedRequest {
  recipeIds: string[];
  resolve: (value: Record<string, RecipeIngredientWithDetails[]>) => void;
  reject: (error: Error) => void;
}

export const requestQueueRef: QueuedRequest[] = [];
export let isProcessingQueueRef = false;

/**
 * Normalize recipe IDs for cache key (sort and join).
 *
 * @param {string[]} recipeIds - Recipe IDs to normalize
 * @returns {string} Normalized cache key
 */
export function normalizeRecipeIds(recipeIds: string[]): string {
  return [...recipeIds].sort().join(',');
}

/**
 * Process request queue sequentially.
 *
 * @param {Function} fetchBatchRecipeIngredients - Function to fetch batch of recipes
 */
export async function processRequestQueue(
  fetchBatchRecipeIngredients: (
    recipeIds: string[],
  ) => Promise<Record<string, RecipeIngredientWithDetails[]>>,
): Promise<void> {
  if (isProcessingQueueRef || requestQueueRef.length === 0) {
    return;
  }

  isProcessingQueueRef = true;

  while (requestQueueRef.length > 0) {
    const currentQueue = [...requestQueueRef];
    requestQueueRef.length = 0;

    const mergedRequests = new Map<string, QueuedRequest[]>();

    currentQueue.forEach(req => {
      const key = normalizeRecipeIds(req.recipeIds);
      if (!mergedRequests.has(key)) {
        mergedRequests.set(key, []);
      }
      mergedRequests.get(key)!.push(req);
    });

    for (const [_key, requests] of mergedRequests.entries()) {
      const recipeIds = requests[0].recipeIds;
      const _cacheKey = normalizeRecipeIds(recipeIds);

      try {
        const result = await fetchBatchRecipeIngredients(recipeIds);
        requests.forEach(req => req.resolve(result));
      } catch (err) {
        logger.error('[pricingRequestQueue.ts] Error in catch block:', {
          error: err instanceof Error ? err.message : String(err),
          stack: err instanceof Error ? err.stack : undefined,
        });

        requests.forEach(req => req.reject(err instanceof Error ? err : new Error(String(err))));
      }
    }
  }

  isProcessingQueueRef = false;
}
