import { logger } from '@/lib/logger';
import { RecipeIngredientWithDetails } from '../../types';
import { handleRetryHelper } from './batchFetchWithRetry/helpers/handleRetry';
import { handleErrorHelper } from './batchFetchWithRetry/helpers/handleError';

/**
 * Batch fetch recipe ingredients with retry logic.
 */
export async function batchFetchWithRetry(
  recipeIds: string[],
  retryCount: number,
  performBatchFetchRef: React.MutableRefObject<((recipeIds: string[], retryCount?: number) => Promise<Record<string, RecipeIngredientWithDetails[]>>) | null>,
): Promise<Record<string, RecipeIngredientWithDetails[]>> {
  if (recipeIds.length === 0) return {};
  const maxRetries = 2;
  const timeoutMs = 15000;
  const getRetryDelay = (attempt: number) => Math.min(500 * Math.pow(2, attempt), 2000);
  try {
    logger.dev(`[RecipeIngredients] Batch fetching for ${recipeIds.length} recipe IDs: ${JSON.stringify(recipeIds)}`);
    const startTime = Date.now();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    const response = await fetch('/api/recipes/ingredients/batch', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ recipeIds }), cache: 'no-store', signal: controller.signal });
    clearTimeout(timeoutId);
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      const errorType = response.status >= 500 ? 'server error' : response.status >= 400 ? 'client error' : 'unknown error';
      logger.error(`[RecipeIngredients] Batch fetch failed: ${response.status} ${errorType} - ${errorText}`);
      if (response.status >= 500) return await handleRetryHelper(recipeIds, retryCount, maxRetries, performBatchFetchRef, getRetryDelay);
      return {};
    }
    const data = await response.json();
    const items = data?.items || {};
    const duration = Date.now() - startTime;
    logger.dev(`[RecipeIngredients] Batch fetch completed in ${duration}ms, got ${Object.keys(items).length} recipe groups`);
    return items as Record<string, RecipeIngredientWithDetails[]>;
  } catch (err) {
    return await handleErrorHelper(err, recipeIds, retryCount, maxRetries, timeoutMs, performBatchFetchRef, getRetryDelay);
  }
}
