import { RecipeIngredientWithDetails } from '../../types';

import { logger } from '@/lib/logger';
/**
 * Fetch recipe ingredients from API with retry logic.
 *
 * @param {string} recipeId - Recipe ID to fetch
 * @param {number} retryCount - Current retry count
 * @param {Function} fetchFromApiRef - Ref to fetch function for recursive calls
 * @returns {Promise<RecipeIngredientWithDetails[] | null>} Recipe ingredients or null on error
 */
export async function fetchWithRetry(
  recipeId: string,
  retryCount: number,
  fetchFromApiRef: React.MutableRefObject<
    | ((recipeId: string, retryCount?: number) => Promise<RecipeIngredientWithDetails[] | null>)
    | null
  >,
): Promise<RecipeIngredientWithDetails[] | null> {
  const maxRetries = 2;
  const timeoutMs = 10000;
  const getRetryDelay = (attempt: number) => Math.min(500 * Math.pow(2, attempt), 2000);

  try {
    const url = `/api/recipes/${recipeId}/ingredients?t=${Date.now()}`;
    logger.dev('[RecipeIngredients] Fetching from API:', url);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const res = await fetch(url, {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate', Pragma: 'no-cache' },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    if (!res.ok) {
      const errorText = await res.text().catch(() => 'Unknown error');
      const errorType =
        res.status >= 500 ? 'server error' : res.status >= 400 ? 'client error' : 'unknown error';
      logger.error(
        `[RecipeIngredients] API fetch failed for recipe ${recipeId}: ${res.status} ${errorType} - ${errorText}`,
      );

      if (res.status >= 500 && retryCount < maxRetries && fetchFromApiRef.current) {
        const delay = getRetryDelay(retryCount);
        logger.dev(
          `[RecipeIngredients] Retrying API fetch for recipe ${recipeId} after ${delay}ms (attempt ${retryCount + 1}/${maxRetries})...`,
        );
        await new Promise(resolve => setTimeout(resolve, delay));
        return fetchFromApiRef.current(recipeId, retryCount + 1);
      }

      return null;
    }
    const data = await res.json();
    return (data?.items || []) as RecipeIngredientWithDetails[];
  } catch (err) {
    logger.error(`[RecipeIngredients] Exception fetching from API for recipe ${recipeId}:`, { error: err instanceof Error ? err.message : String(err) });
    if (err instanceof Error) {
      logger.error('[RecipeIngredients] Error details:', { error: err.message, stack: err.stack });

      const isAbortError = err.name === 'AbortError';
      const isNetworkError = err.name === 'TypeError' && err.message.includes('fetch');

      if (isAbortError) {
        logger.error(
          `[RecipeIngredients] Request timeout - server did not respond within ${timeoutMs}ms`,
        );
      } else if (isNetworkError) {
        logger.error(
          '[RecipeIngredients] Network error detected - check if dev server is running and API route exists',
        );
      }

      if ((isNetworkError || isAbortError) && retryCount < maxRetries && fetchFromApiRef.current) {
        const delay = getRetryDelay(retryCount);
        const errorType = isAbortError ? 'timeout' : 'network error';
        logger.dev(
          `[RecipeIngredients] Retrying API fetch after ${errorType} for recipe ${recipeId} after ${delay}ms (attempt ${retryCount + 1}/${maxRetries})...`,
        );
        await new Promise(resolve => setTimeout(resolve, delay));
        return fetchFromApiRef.current(recipeId, retryCount + 1);
      }
    }
    return null;
  }
}
