import { RecipeIngredientWithDetails } from '@/lib/types/recipes';
import { logger } from '@/lib/logger';
import {
  isProcessingQueueRef,
  normalizeRecipeIds,
  processRequestQueue,
  requestQueueRef,
} from './pricingRequestQueue';

/**
 * Deduplicated batch fetch with queue management.
 *
 * @param {Object} params - Batch fetch parameters
 * @returns {Promise<Record<string, RecipeIngredientWithDetails[]>>} Recipe ingredients by recipe ID
 */
export async function fetchBatchWithDeduplication({
  recipeIds,
  fetchBatchRecipeIngredients,
  batchRequestCacheRef,
}: {
  recipeIds: string[];
  fetchBatchRecipeIngredients: (
    recipeIds: string[],
  ) => Promise<Record<string, RecipeIngredientWithDetails[]>>;
  batchRequestCacheRef: React.MutableRefObject<
    Map<string, Promise<Record<string, RecipeIngredientWithDetails[]>>>
  >;
}): Promise<Record<string, RecipeIngredientWithDetails[]>> {
  const cacheKey = normalizeRecipeIds(recipeIds);

  const cachedPromise = batchRequestCacheRef.current.get(cacheKey);
  if (cachedPromise) {
    return cachedPromise;
  }

  if (isProcessingQueueRef || requestQueueRef.length > 0) {
    return new Promise<Record<string, RecipeIngredientWithDetails[]>>((resolve, reject) => {
      requestQueueRef.push({ recipeIds, resolve, reject });
      if (!isProcessingQueueRef) {
        processRequestQueue(fetchBatchRecipeIngredients).catch(err => {
          logger.error('[RecipePricing] Queue processing error:', err);
        });
      }
    });
  }

  const batchPromise = fetchBatchRecipeIngredients(recipeIds)
    .then(result => {
      batchRequestCacheRef.current.delete(cacheKey);
      processRequestQueue(fetchBatchRecipeIngredients).catch(err => {
        logger.error('[RecipePricing] Queue processing error:', err);
      });
      return result;
    })
    .catch(err => {
      batchRequestCacheRef.current.delete(cacheKey);
      processRequestQueue(fetchBatchRecipeIngredients).catch(processErr => {
        logger.error('[RecipePricing] Queue processing error:', processErr);
      });
      throw err;
    });

  batchRequestCacheRef.current.set(cacheKey, batchPromise);
  return batchPromise;
}
