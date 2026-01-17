/**
 * Hook for comprehensive scraping handlers
 */

import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';
import { useCallback } from 'react';
import { ComprehensiveJobStatus } from '../types';
import { createStopHandler } from './useComprehensiveScrapingHandlers/stop-handler';

interface UseComprehensiveScrapingHandlersParams {
  setComprehensiveScraping: (value: boolean) => void;
  setComprehensiveStatus: (status: ComprehensiveJobStatus | null) => void;
  setStatusPolling: (polling: boolean) => void;
  fetchComprehensiveStatus: () => Promise<void>;
}

export function useComprehensiveScrapingHandlers({
  setComprehensiveScraping,
  setComprehensiveStatus,
  setStatusPolling,
  fetchComprehensiveStatus,
}: UseComprehensiveScrapingHandlersParams) {
  const { showSuccess, showError } = useNotification();

  const handleComprehensiveScrape = useCallback(async () => {
    setComprehensiveScraping(true);
    try {
      const response = await fetch('/api/recipe-scraper/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comprehensive: true }),
      });
      const result = (await response.json()) as {
        success: boolean;
        data: { jobStatus: ComprehensiveJobStatus };
        message?: string;
      };

      if (result.success) {
        setComprehensiveStatus(result.data.jobStatus);
        setStatusPolling(true);
        showSuccess(
          'Comprehensive scraping job started! This will scrape ALL recipes from all sources.',
        );
      } else {
        showError(result.message || 'Failed to start comprehensive scraping');
      }
    } catch (err) {
      logger.error('[RecipeScraper] Error starting comprehensive scrape:', {
        error: err instanceof Error ? err.message : String(err),
      });
      showError('Failed to start comprehensive scraping');
    } finally {
      setComprehensiveScraping(false);
    }
  }, [setComprehensiveScraping, setComprehensiveStatus, setStatusPolling, showSuccess, showError]);

  const handleStopComprehensiveScrape = useCallback(
    createStopHandler({ setComprehensiveStatus, setStatusPolling, showSuccess, showError }),
    [setComprehensiveStatus, setStatusPolling, showSuccess, showError],
  );

  const handleResumeComprehensiveScrape = useCallback(async () => {
    try {
      showSuccess('Resuming scraper...');

      const response = await fetch('/api/recipe-scraper/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const errorData = (await response.json().catch(() => ({ error: 'Unknown error' }))) as {
          error?: string;
        };
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const result = (await response.json()) as {
        success: boolean;
        data: { status: ComprehensiveJobStatus };
        message?: string;
      };

      if (result.success) {
        setComprehensiveStatus(result.data.status);
        setStatusPolling(true);
        showSuccess('Scraping job resumed! Continuing from saved progress.');
      } else {
        showError(result.message || 'Failed to resume scraping job');
      }
    } catch (err) {
      logger.error('[RecipeScraper] Error resuming comprehensive scrape:', {
        error: err instanceof Error ? err.message : String(err),
      });
      showError(
        `Failed to resume scraping job: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }, [setComprehensiveStatus, setStatusPolling, showSuccess, showError]);

  const handleRefreshStatus = useCallback(async () => {
    try {
      const response = await fetch('/api/recipe-scraper/status');
      const result = (await response.json()) as { success: boolean; data: ComprehensiveJobStatus };
      if (result.success) {
        setComprehensiveStatus(result.data);
        if (result.data.isRunning) {
          setStatusPolling(true);
        }
        showSuccess('Status refreshed');
      }
    } catch (err) {
      logger.error('[RecipeScraper] Error refreshing status:', {
        error: err instanceof Error ? err.message : String(err),
      });
      showError('Failed to refresh status');
    }
  }, [setComprehensiveStatus, setStatusPolling, showSuccess, showError]);

  return {
    handleComprehensiveScrape,
    handleStopComprehensiveScrape,
    handleResumeComprehensiveScrape,
    handleRefreshStatus,
  };
}
