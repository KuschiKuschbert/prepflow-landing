/**
 * Hook for processing operations
 */

import { useCallback } from 'react';
import { logger } from '@/lib/logger';

interface UseProcessingOperationsParams {
  setProcessing: (processing: any) => void;
  setIsResuming: (resuming: boolean) => void;
  setIsProcessingStarting: (starting: boolean) => void;
  setProcessingPolling: (polling: boolean) => void;
  fetchProcessingStatus: () => Promise<void>;
}

export function useProcessingOperations({
  setProcessing,
  setIsResuming,
  setIsProcessingStarting,
  setProcessingPolling,
  fetchProcessingStatus,
}: UseProcessingOperationsParams) {
  const startProcessing = useCallback(
    async (limit?: number, model?: string) => {
      setIsProcessingStarting(true);
      try {
        const response = await fetch('/api/recipe-scraper/process-recipes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'start', limit, model }),
        });

        const result = await response.json();
        if (result.success) {
          setProcessingPolling(true);
          await fetchProcessingStatus();
        } else {
          logger.error('[Recipe Scraper] Failed to start processing:', result);
        }
      } catch (error) {
        logger.error('[Recipe Scraper] Error starting processing:', {
          error: error instanceof Error ? error.message : String(error),
        });
      } finally {
        setIsProcessingStarting(false);
      }
    },
    [setIsProcessingStarting, setProcessingPolling, fetchProcessingStatus],
  );

  const pauseProcessing = useCallback(async () => {
    try {
      const response = await fetch('/api/recipe-scraper/process-recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'pause' }),
      });

      const result = await response.json();
      if (result.success) {
        setProcessing(result.data);
      }
    } catch (error) {
      logger.error('[Recipe Scraper] Error pausing processing:', {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }, [setProcessing]);

  const resumeProcessing = useCallback(async () => {
    setIsResuming(true);
    try {
      const response = await fetch('/api/recipe-scraper/process-recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'resume' }),
      });

      const result = await response.json();
      if (result.success) {
        setProcessing(result.data);
        setProcessingPolling(true);
        await fetchProcessingStatus();
      }
    } catch (error) {
      logger.error('[Recipe Scraper] Error resuming processing:', {
        error: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setTimeout(() => setIsResuming(false), 1000);
    }
  }, [setIsResuming, setProcessing, setProcessingPolling, fetchProcessingStatus]);

  const stopProcessing = useCallback(async () => {
    try {
      const response = await fetch('/api/recipe-scraper/process-recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'stop' }),
      });

      const result = await response.json();
      if (result.success) {
        setProcessing(result.data);
        setProcessingPolling(false);
      }
    } catch (error) {
      logger.error('[Recipe Scraper] Error stopping processing:', {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }, [setProcessing, setProcessingPolling]);

  return { startProcessing, pauseProcessing, resumeProcessing, stopProcessing };
}
