/**
 * Stop comprehensive scraping handler
 */

import { logger } from '@/lib/logger';

interface StopHandlerParams {
  setComprehensiveStatus: (status: unknown) => void;
  setStatusPolling: (polling: boolean) => void;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
}

export function createStopHandler({
  setComprehensiveStatus,
  setStatusPolling,
  showSuccess,
  showError,
}: StopHandlerParams) {
  return async () => {
    try {
      showSuccess('Pausing scraper... (progress will be saved)');

      const response = await fetch('/api/recipe-scraper/stop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setStatusPolling(true);
        showSuccess('Pause command sent! Scraper will pause at next checkpoint (progress saved).');

        const refreshStatus = async () => {
          try {
            const statusResponse = await fetch('/api/recipe-scraper/status');
            const statusData = await statusResponse.json();
            if (statusData.success) {
              setComprehensiveStatus(statusData.data);
              if (statusData.data.isRunning) {
                setTimeout(refreshStatus, 2000);
              } else {
                showSuccess('✅ Scraper has paused successfully!');
                setStatusPolling(false);
              }
            }
          } catch (err) {
            logger.error('[RecipeScraper] Error fetching status after pause:', {
              error: err instanceof Error ? err.message : String(err),
            });
          }
        };

        setTimeout(refreshStatus, 1000);
      } else {
        showError(result.message || 'Failed to pause scraping job');
      }
    } catch (err) {
      logger.error('[RecipeScraper] Error pausing comprehensive scrape:', {
        error: err instanceof Error ? err.message : String(err),
      });
      showError(
        `Failed to pause scraping job: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  };
}
