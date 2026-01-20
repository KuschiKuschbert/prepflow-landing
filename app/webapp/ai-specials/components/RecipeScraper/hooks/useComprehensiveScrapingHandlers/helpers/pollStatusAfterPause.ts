import { logger } from '@/lib/logger';
import { ComprehensiveJobStatus } from '../../../types';

interface PollStatusParams {
  setComprehensiveStatus: (status: ComprehensiveJobStatus | null) => void;
  setStatusPolling: (polling: boolean) => void;
  showSuccess: (message: string) => void;
}

export async function pollStatusAfterPause({
  setComprehensiveStatus,
  setStatusPolling,
  showSuccess,
}: PollStatusParams): Promise<void> {
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
}
