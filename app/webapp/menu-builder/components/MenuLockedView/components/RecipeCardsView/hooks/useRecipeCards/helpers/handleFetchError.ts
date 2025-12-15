/**
 * Handle fetch error for recipe cards.
 */
import { logger } from '@/lib/logger';

interface HandleFetchErrorParams {
  err: unknown;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  stopPolling: () => void;
  onError?: (error: string) => void;
}

export function handleFetchError({
  err,
  setError,
  setLoading,
  stopPolling,
  onError,
}: HandleFetchErrorParams): void {
  if (err instanceof Error && err.name === 'AbortError') {
    logger.dev('[useRecipeCards] Request aborted');
    return;
  }

  const errorMsg = err instanceof Error ? err.message : 'Failed to fetch recipe cards';
  logger.error('[useRecipeCards] Error fetching cards:', err);
  setError(errorMsg);
  setLoading(false);
  onError?.(errorMsg);
  stopPolling();
}
