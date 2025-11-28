/**
 * Hook for fetching and managing recipe cards.
 */

import { logger } from '@/lib/logger';
import { useEffect, useRef } from 'react';
import { useCardState } from './useRecipeCards/helpers/useCardState';
import { fetchCards } from './useRecipeCards/helpers/fetchCards';
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
  }, [menuId]);

  useEffect(() => {
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

        if (controller.signal.aborted) {
          return;
        }

        if (result.success) {
          // Update main cards
          if (result.cards) {
            setCards(prevCards => {
              const newCardCount = result.cards!.length;
              const currentCardCount = prevCards.length;

              // Update if we have new cards or if this is the first load
              if (newCardCount > currentCardCount || currentCardCount === 0) {
                // If we have cards now and were polling, stop polling
                if (newCardCount > 0) {
                  stopPolling();
                }
                return result.cards!;
              }
              return prevCards; // No change
            });
          }

          // Update sub-recipe cards
          if (result.subRecipeCards) {
            setSubRecipeCards(result.subRecipeCards);
          }

          setLoading(false);

          // If we have no cards and haven't started polling yet, start polling
          if (result.cards && result.cards.length === 0) {
            startPolling(() => performFetch(true));
          }
        } else {
          setError(result.error || 'Failed to load recipe cards');
          setLoading(false);
        }
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          logger.dev('[useRecipeCards] Request aborted');
          return;
        }

        const errorMsg = err instanceof Error ? err.message : 'Failed to fetch recipe cards';
        logger.error('[useRecipeCards] Error fetching cards:', err);
        setError(errorMsg);
        setLoading(false);
        if (onError) {
          onError(errorMsg);
        }

        // Stop polling on error
        stopPolling();
      }
    }

    // Reset polling state when menuId changes
    resetPolling();

    // Initial fetch
    performFetch(false);

    // Cleanup: abort any pending requests and clear polling interval
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
      stopPolling();
    };
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
