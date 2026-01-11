/**
 * Hook for comprehensive scraping operations
 */

import { useCallback } from 'react';
import { logger } from '@/lib/logger';

interface UseComprehensiveScrapingParams {
  setComprehensiveScraping: (value: boolean) => void;
  setComprehensiveStatus: (status: any) => void;
  setStatusPolling: (polling: boolean) => void;
  fetchComprehensiveStatus: () => Promise<void>;
}

export function useComprehensiveScraping({
  setComprehensiveScraping,
  setComprehensiveStatus,
  setStatusPolling,
  fetchComprehensiveStatus,
}: UseComprehensiveScrapingParams) {
  const startComprehensive = useCallback(async () => {
    try {
      const response = await fetch('/api/recipe-scraper/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comprehensive: true }),
      });

      const result = await response.json();
      if (result.success) {
        setComprehensiveScraping(true);
        setComprehensiveStatus(result.data?.jobStatus || null);
        setStatusPolling(true);
        await fetchComprehensiveStatus();
      } else {
        logger.error('[Recipe Scraper] Failed to start comprehensive scraping:', result);
      }
    } catch (error) {
      logger.error('[Recipe Scraper] Error starting comprehensive scraping:', {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }, [setComprehensiveScraping, setComprehensiveStatus, setStatusPolling, fetchComprehensiveStatus]);

  const stopComprehensive = useCallback(async () => {
    try {
      const response = await fetch('/api/recipe-scraper/comprehensive/stop', {
        method: 'POST',
      });
      const result = await response.json();
      if (result.success) {
        setComprehensiveScraping(false);
        setStatusPolling(false);
        await fetchComprehensiveStatus();
      }
    } catch (error) {
      logger.error('[Recipe Scraper] Error stopping comprehensive scraping:', {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }, [setComprehensiveScraping, setStatusPolling, fetchComprehensiveStatus]);

  const resumeComprehensive = useCallback(async () => {
    try {
      const response = await fetch('/api/recipe-scraper/comprehensive/resume', {
        method: 'POST',
      });
      const result = await response.json();
      if (result.success) {
        setComprehensiveScraping(true);
        setStatusPolling(true);
        await fetchComprehensiveStatus();
      }
    } catch (error) {
      logger.error('[Recipe Scraper] Error resuming comprehensive scraping:', {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }, [setComprehensiveScraping, setStatusPolling, fetchComprehensiveStatus]);

  return {
    startComprehensive,
    stopComprehensive,
    resumeComprehensive,
  };
}
