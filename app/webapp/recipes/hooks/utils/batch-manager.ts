import { logger } from '@/lib/logger';
import { RecipeIngredientWithDetails } from '../../types';
import {
  globalBatchRequestCache,
  globalRequestQueue,
  isProcessingQueue,
  normalizeRecipeIds,
  processBatchRequestQueue,
} from './batchRequestQueue';

type BatchFetchFn = (
  recipeIds: string[],
  retryCount?: number,
) => Promise<Record<string, RecipeIngredientWithDetails[]>>;

export async function manageBatchRequest(
  recipeIds: string[],
  performBatchFetch: BatchFetchFn,
): Promise<Record<string, RecipeIngredientWithDetails[]>> {
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

  const handleQueueError = (err: unknown) =>
    logger.error('[RecipeIngredients] Queue processing error:', err);

  const batchPromise = performBatchFetch(recipeIds)
    .then(result => {
      globalBatchRequestCache.delete(cacheKey);
      processBatchRequestQueue(performBatchFetch).catch(handleQueueError);
      return result;
    })
    .catch(err => {
      globalBatchRequestCache.delete(cacheKey);
      processBatchRequestQueue(performBatchFetch).catch(handleQueueError);
      throw err;
    });

  globalBatchRequestCache.set(cacheKey, batchPromise);
  return batchPromise;
}
