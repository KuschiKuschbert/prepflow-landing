import { RecipeIngredientWithDetails } from '../../types';

/**
 * Batch fetch recipe ingredients with retry logic.
 *
 * @param {string[]} recipeIds - Recipe IDs to fetch
 * @param {number} retryCount - Current retry count
 * @param {Function} performBatchFetchRef - Ref to batch fetch function for recursive calls
 * @returns {Promise<Record<string, RecipeIngredientWithDetails[]>>} Recipe ingredients by recipe ID
 */
export async function batchFetchWithRetry(
  recipeIds: string[],
  retryCount: number,
  performBatchFetchRef: React.MutableRefObject<
    | ((
        recipeIds: string[],
        retryCount?: number,
      ) => Promise<Record<string, RecipeIngredientWithDetails[]>>)
    | null
  >,
): Promise<Record<string, RecipeIngredientWithDetails[]>> {
  if (recipeIds.length === 0) return {};
  const maxRetries = 2;
  const timeoutMs = 15000;
  const getRetryDelay = (attempt: number) => Math.min(500 * Math.pow(2, attempt), 2000);

  try {
    console.log(
      '[RecipeIngredients] Batch fetching for',
      recipeIds.length,
      'recipe IDs:',
      recipeIds,
    );
    const startTime = Date.now();
    const url = '/api/recipes/ingredients/batch';

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipeIds }),
      cache: 'no-store',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      const errorType =
        response.status >= 500
          ? 'server error'
          : response.status >= 400
            ? 'client error'
            : 'unknown error';
      console.error(
        `[RecipeIngredients] Batch fetch failed: ${response.status} ${errorType} - ${errorText}`,
      );

      if (response.status >= 500 && retryCount < maxRetries && performBatchFetchRef.current) {
        const delay = getRetryDelay(retryCount);
        console.log(
          `[RecipeIngredients] Retrying batch fetch after ${delay}ms (attempt ${retryCount + 1}/${maxRetries})...`,
        );
        await new Promise(resolve => setTimeout(resolve, delay));
        return performBatchFetchRef.current(recipeIds, retryCount + 1);
      }

      return {};
    }

    const data = await response.json();
    const items = data?.items || {};
    const duration = Date.now() - startTime;
    console.log(
      '[RecipeIngredients] Batch fetch completed in',
      duration,
      'ms, got',
      Object.keys(items).length,
      'recipe groups',
    );
    return items as Record<string, RecipeIngredientWithDetails[]>;
  } catch (err) {
    console.error('[RecipeIngredients] Batch fetch exception:', err);
    if (err instanceof Error) {
      const isAbortError = err.name === 'AbortError';
      const isNetworkError = err.name === 'TypeError' && err.message.includes('fetch');

      if (isAbortError) {
        console.error(
          `[RecipeIngredients] Request timeout - server did not respond within ${timeoutMs}ms for ${recipeIds.length} recipes`,
        );
      } else if (isNetworkError) {
        console.error(
          '[RecipeIngredients] Network error detected - check if dev server is running and API route exists',
        );
      }

      if (
        (isNetworkError || isAbortError) &&
        retryCount < maxRetries &&
        performBatchFetchRef.current
      ) {
        const delay = getRetryDelay(retryCount);
        const errorType = isAbortError ? 'timeout' : 'network error';
        console.log(
          `[RecipeIngredients] Retrying batch fetch after ${errorType} after ${delay}ms (attempt ${retryCount + 1}/${maxRetries})...`,
        );
        await new Promise(resolve => setTimeout(resolve, delay));
        return performBatchFetchRef.current(recipeIds, retryCount + 1);
      }
    }
    return {};
  }
}
