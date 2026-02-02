import { RecipeIngredientWithDetails } from '@/lib/types/recipes';
import { logger } from '@/lib/logger';

// Module-level shared cache for batch requests (shared across all hook instances)
export const globalBatchRequestCache = new Map<
  string,
  Promise<Record<string, RecipeIngredientWithDetails[]>>
>();
export const globalRequestQueue: Array<{
  recipeIds: string[];
  resolve: (value: Record<string, RecipeIngredientWithDetails[]>) => void;
  reject: (error: Error) => void;
}> = [];
export let isProcessingQueue = false;

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
 * @param {Function} fetchBatch - Function to fetch batch of recipes
 */
export async function processBatchRequestQueue(
  fetchBatch: (recipeIds: string[]) => Promise<Record<string, RecipeIngredientWithDetails[]>>,
): Promise<void> {
  if (isProcessingQueue || globalRequestQueue.length === 0) {
    return;
  }

  isProcessingQueue = true;

  while (globalRequestQueue.length > 0) {
    const currentQueue = [...globalRequestQueue];
    globalRequestQueue.length = 0;

    const mergedRequests = new Map<string, typeof currentQueue>();

    currentQueue.forEach(req => {
      const key = normalizeRecipeIds(req.recipeIds);
      if (!mergedRequests.has(key)) {
        mergedRequests.set(key, []);
      }
      mergedRequests.get(key)!.push(req);
    });

    for (const [_key, requests] of mergedRequests.entries()) {
      const recipeIds = requests[0].recipeIds;
      const cacheKey = normalizeRecipeIds(recipeIds);

      const cachedPromise = globalBatchRequestCache.get(cacheKey);
      if (cachedPromise) {
        cachedPromise
          .then(result => {
            requests.forEach(req => req.resolve(result));
          })
          .catch(err => {
            requests.forEach(req => req.reject(err));
          });
        continue;
      }

      const batchPromise = fetchBatch(recipeIds)
        .then(result => {
          globalBatchRequestCache.delete(cacheKey);
          return result;
        })
        .catch(err => {
          globalBatchRequestCache.delete(cacheKey);
          throw err;
        });

      globalBatchRequestCache.set(cacheKey, batchPromise);

      try {
        const result = await batchPromise;
        requests.forEach(req => req.resolve(result));
      } catch (err) {
        logger.error('[batchRequestQueue.ts] Error in catch block:', {
          error: err instanceof Error ? err.message : String(err),
          stack: err instanceof Error ? err.stack : undefined,
        });

        requests.forEach(req => req.reject(err instanceof Error ? err : new Error(String(err))));
      }
    }
  }

  isProcessingQueue = false;
}
