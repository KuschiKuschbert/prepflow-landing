/**
 * Hook for formatting handlers
 */

import { useCallback } from 'react';
import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';

interface UseFormattingHandlersParams {
  processing: any;
  setIsResuming: (resuming: boolean) => void;
  setIsProcessingStarting: (starting: boolean) => void;
  setProcessingPolling: (polling: boolean) => void;
  fetchProcessingStatus: () => Promise<void>;
}

export function useFormattingHandlers({
  processing,
  setIsResuming,
  setIsProcessingStarting,
  setProcessingPolling,
  fetchProcessingStatus,
}: UseFormattingHandlersParams) {
  const { showSuccess, showError } = useNotification();

  const handleResumeFormatting = useCallback(async () => {
    setIsResuming(true);
    try {
      const response = await fetch('/api/recipe-scraper/process-recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'resume' }),
      });
      const result = await response.json();

      if (result.success) {
        showSuccess('Formatting resumed');
        setProcessingPolling(true);
        setTimeout(() => {
          fetchProcessingStatus();
        }, 1000);
      } else {
        showError(result.message || 'Failed to resume formatting');
      }
    } catch (err) {
      logger.error('[RecipeScraper] Error resuming formatting:', {
        error: err instanceof Error ? err.message : String(err),
      });
      showError('Failed to resume formatting');
    } finally {
      setIsResuming(false);
    }
  }, [setIsResuming, setProcessingPolling, fetchProcessingStatus, showSuccess, showError]);

  const handlePauseFormatting = useCallback(async () => {
    try {
      const response = await fetch('/api/recipe-scraper/process-recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'pause' }),
      });
      const result = await response.json();

      if (result.success) {
        showSuccess('Formatting paused');
        fetchProcessingStatus();
      } else {
        showError(result.message || 'Failed to pause formatting');
      }
    } catch (err) {
      logger.error('[RecipeScraper] Error pausing formatting:', {
        error: err instanceof Error ? err.message : String(err),
      });
      showError('Failed to pause formatting');
    }
  }, [fetchProcessingStatus, showSuccess, showError]);

  const handleProcessAllRecipes = useCallback(async () => {
    if (processing?.isProcessing && !processing?.isPaused) {
      showError('Processing is already in progress');
      return;
    }

    setIsProcessingStarting(true);
    try {
      showSuccess('Starting recipe processing...');

      const response = await fetch('/api/recipe-scraper/process-recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'start' }),
      });

      const result = await response.json();

      if (result.success) {
        showSuccess('Processing started in background');
        setProcessingPolling(true);
        setTimeout(() => {
          fetchProcessingStatus();
        }, 1000);
      } else {
        showError(result.message || 'Failed to start processing');
      }
    } catch (err) {
      logger.error('[RecipeScraper] Error starting processing:', {
        error: err instanceof Error ? err.message : String(err),
      });
      showError('Failed to start processing. Please try again.');
    } finally {
      setIsProcessingStarting(false);
    }
  }, [processing, setIsProcessingStarting, setProcessingPolling, fetchProcessingStatus, showSuccess, showError]);

  return { handleResumeFormatting, handlePauseFormatting, handleProcessAllRecipes };
}
