/**
 * Handle error cases for batch fetch.
 */
import { logger } from '@/lib/logger';
import type { RecipeIngredientWithDetails } from '@/lib/types/recipes';

export async function handleErrorHelper(
  err: unknown,
  recipeIds: string[],
  retryCount: number,
  maxRetries: number,
  timeoutMs: number,
  performBatchFetchRef: React.MutableRefObject<
    | ((
        recipeIds: string[],
        retryCount?: number,
      ) => Promise<Record<string, RecipeIngredientWithDetails[]>>)
    | null
  >,
  getRetryDelay: (attempt: number) => number,
): Promise<Record<string, RecipeIngredientWithDetails[]>> {
  logger.error('[RecipeIngredients] Batch fetch exception:', err);
  if (!(err instanceof Error)) return {};
  const isAbortError = err.name === 'AbortError';
  const isNetworkError = err.name === 'TypeError' && err.message.includes('fetch');
  if (isAbortError) {
    logger.error(
      `[RecipeIngredients] Request timeout - server did not respond within ${timeoutMs}ms for ${recipeIds.length} recipes`,
    );
  } else if (isNetworkError) {
    logger.error(
      '[RecipeIngredients] Network error detected - check if dev server is running and API route exists',
    );
  }
  if ((isNetworkError || isAbortError) && retryCount < maxRetries && performBatchFetchRef.current) {
    const delay = getRetryDelay(retryCount);
    const errorType = isAbortError ? 'timeout' : 'network error';
    logger.dev(
      `[RecipeIngredients] Retrying batch fetch after ${errorType} after ${delay}ms (attempt ${retryCount + 1}/${maxRetries})...`,
    );
    await new Promise(resolve => setTimeout(resolve, delay));
    return performBatchFetchRef.current(recipeIds, retryCount + 1);
  }
  return {};
}
