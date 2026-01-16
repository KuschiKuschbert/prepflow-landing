/**
 * Hook for status polling operations
 */

import { logger } from '@/lib/logger';
import { useEffect } from 'react';
import { ComprehensiveJobStatus } from '../types';

interface UseStatusPollingParams {
  statusPolling: boolean;
  setComprehensiveStatus: (status: ComprehensiveJobStatus | null) => void;
  setStatusPolling: (polling: boolean) => void;
  fetchRecipes: (page: number, pageSize: number) => void;
  page: number;
  pageSize: number;
  processingPolling: boolean;
  fetchProcessingStatus: () => Promise<void>;
}

export function useStatusPolling({
  statusPolling,
  setComprehensiveStatus,
  setStatusPolling,
  fetchRecipes,
  page,
  pageSize,
  processingPolling,
  fetchProcessingStatus,
}: UseStatusPollingParams) {
  // Poll comprehensive scraping status
  useEffect(() => {
    if (!statusPolling) return;

    const pollStatus = async () => {
      try {
        const response = await fetch('/api/recipe-scraper/status');
        const result = await response.json();
        if (result.success) {
          setComprehensiveStatus(result.data);
          if (!result.data.isRunning) {
            setStatusPolling(false);
            fetchRecipes(page, pageSize);
          }
        }
      } catch (err) {
        logger.error('[RecipeScraper] Error fetching status:', {
          error: err instanceof Error ? err.message : String(err),
        });
      }
    };

    pollStatus();
    const interval = setInterval(pollStatus, 5000);

    return () => clearInterval(interval);
  }, [statusPolling, setComprehensiveStatus, setStatusPolling, fetchRecipes, page, pageSize]);

  // Poll processing status
  useEffect(() => {
    if (!processingPolling) return;

    const pollProcessingStatus = async () => {
      await fetchProcessingStatus();
    };

    pollProcessingStatus();
    const interval = setInterval(pollProcessingStatus, 10000);

    return () => clearInterval(interval);
  }, [processingPolling, fetchProcessingStatus]);
}
