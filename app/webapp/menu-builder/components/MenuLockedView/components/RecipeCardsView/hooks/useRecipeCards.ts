/**
 * Hook for fetching and managing recipe cards.
 */
import { logger } from '@/lib/logger';
import { useEffect, useRef } from 'react';
import { createCleanup } from './useRecipeCards/helpers/createCleanup';
import { fetchCards } from './useRecipeCards/helpers/fetchCards';
import { handleFetchError } from './useRecipeCards/helpers/handleFetchError';
import { updateCards } from './useRecipeCards/helpers/updateCards';
import { useCardState } from './useRecipeCards/helpers/useCardState';
import { usePolling } from './useRecipeCards/helpers/usePolling';

interface UseRecipeCardsOptions {
  menuId: string;
  onError?: (error: string) => void;
}

export function useRecipeCards({ menuId, onError }: UseRecipeCardsOptions) {
  const {
    cards,
    setCards,
    subRecipeCards,
    setSubRecipeCards,
    loading,
    setLoading,
    error,
    setError,
  } = useCardState();
  const abortControllerRef = useRef<AbortController | null>(null);
  const { pollingRef, startPolling, stopPolling, resetPolling } = usePolling();

  useEffect(() => {
    logger.dev('[useRecipeCards] Hook mounted', { menuId });
    async function performFetch(isPollingCheck = false) {
      try {
        // Only show loading spinner on initial load, not during polling
        if (!isPollingCheck) {
          setLoading(true);
        }
        setError(null);

        // Cancel previous request if it exists
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }

        const controller = new AbortController();
        abortControllerRef.current = controller;

        const result = await fetchCards(menuId, controller.signal);
        if (controller.signal.aborted) return;

        updateCards({
          result,
          setCards,
          setSubRecipeCards,
          setLoading,
          setError,
          startPolling,
          stopPolling,
          performFetch,
        });
      } catch (err) {
        logger.error('[useRecipeCards.ts] Error in catch block:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    });

        handleFetchError({ err, setError, setLoading, stopPolling, onError });
      }
    }

    resetPolling();
    performFetch(false);
    return createCleanup({ abortControllerRef, stopPolling });
  }, [
    menuId,
    onError,
    setLoading,
    setError,
    setCards,
    setSubRecipeCards,
    startPolling,
    stopPolling,
    resetPolling,
  ]);

  return {
    cards,
    subRecipeCards,
    loading,
    error,
    setCards,
    setSubRecipeCards,
    setError,
    setLoading,
    pollingRef,
  };
}
