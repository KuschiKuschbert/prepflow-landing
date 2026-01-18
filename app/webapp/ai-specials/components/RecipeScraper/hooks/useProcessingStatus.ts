/**
 * Hook for processing status operations
 */

import { useCallback } from 'react';
import { logger } from '@/lib/logger';
import { useSessionTimeout } from '@/hooks/useSessionTimeout';

interface ProcessingState {
  isProcessing: boolean;
  isPaused: boolean;
  queueLength: number;
  activeProcessing: number;
  totalProcessed: number;
  totalRecipes: number;
  skippedFormatted?: number;
  progressPercent: number;
  aiProvider?: string;
  aiProviderModel?: string;
  lastError?: string;
  lastProcessedRecipe?: string;
  isStuck?: boolean;
  stuckReason?: string;
  healthStatus?: 'healthy' | 'warning' | 'error';
  processingDuration?: number;
  startedAt?: string;
}

interface UseProcessingStatusParams {
  processing: ProcessingState | null;
  setProcessing: (processing: ProcessingState | null) => void;
  setProcessingPolling: (polling: boolean) => void;
  fetchRecipes: (page: number, pageSize: number) => void;
  page: number;
  pageSize: number;
}

export function useProcessingStatus({
  processing,
  setProcessing,
  setProcessingPolling,
  fetchRecipes,
  page,
  pageSize,
}: UseProcessingStatusParams) {
  const { resetTimeout } = useSessionTimeout({ enabled: true });

  const fetchProcessingStatus = useCallback(async () => {
    try {
      const previousProcessing = processing?.isProcessing && !processing?.isPaused;
      const _previousQueueLength = processing?.queueLength || 0;

      const response = await fetch('/api/recipe-scraper/process-recipes');
      const result = await response.json();
      if (result.success && result.data) {
        const status = result.data;
        setProcessing({
          isProcessing: status.isProcessing || false,
          isPaused: status.isPaused || false,
          queueLength: status.queueLength || 0,
          activeProcessing: status.activeProcessing || 0,
          totalProcessed: status.totalProcessed || 0,
          totalRecipes: status.totalRecipes || 0,
          skippedFormatted: status.skippedFormatted,
          progressPercent:
            status.totalRecipes > 0 ? (status.totalProcessed / status.totalRecipes) * 100 : 0,
          aiProvider: status.aiProvider,
          aiProviderModel: status.aiProviderModel,
          lastError: status.lastError,
          lastProcessedRecipe: status.lastProcessedRecipe,
          isStuck: status.isStuck,
          stuckReason: status.stuckReason,
          healthStatus: status.healthStatus,
          processingDuration: status.processingDuration,
          startedAt: status.startedAt,
        });

        if (status.queueLength > 0 || status.activeProcessing > 0) {
          resetTimeout();
          logger.dev('[RecipeScraper] Processing active - session timeout extended');
        }

        const currentProcessing = status.isProcessing && !status.isPaused;
        if (previousProcessing && !currentProcessing && status.queueLength === 0) {
          logger.dev('[RecipeScraper] Processing completed, refreshing recipe list');
          fetchRecipes(page, pageSize);
        }

        if (currentProcessing) {
          setProcessingPolling(true);
        } else if (!status.isProcessing && status.queueLength === 0) {
          setProcessingPolling(false);
        }
      }
    } catch (err) {
      logger.error('[RecipeScraper] Error fetching processing status:', {
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }, [processing, setProcessing, setProcessingPolling, fetchRecipes, page, pageSize, resetTimeout]);

  return { fetchProcessingStatus };
}
