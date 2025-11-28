/**
 * Hook for managing polling logic.
 */

import { useRef } from 'react';
import { logger } from '@/lib/logger';

const MAX_POLLS = 60; // Poll for up to 2 minutes (60 * 2 seconds)
const POLL_INTERVAL = 2000; // Poll every 2 seconds

export function usePolling() {
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const hasStartedPollingRef = useRef(false);
  const pollCountRef = useRef(0);

  const startPolling = (fetchFn: () => Promise<void>) => {
    if (hasStartedPollingRef.current || pollingRef.current) {
      return; // Already polling
    }

    logger.dev('[useRecipeCards] Starting polling for progressive loading');
    hasStartedPollingRef.current = true;
    pollCountRef.current = 0;

    pollingRef.current = setInterval(() => {
      pollCountRef.current++;
      if (pollCountRef.current >= MAX_POLLS) {
        stopPolling();
        return;
      }

      fetchFn().catch(err => {
        logger.error('[useRecipeCards] Polling error:', err);
      });
    }, POLL_INTERVAL);
  };

  const stopPolling = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
      hasStartedPollingRef.current = false;
      pollCountRef.current = 0;
    }
  };

  const resetPolling = () => {
    stopPolling();
    hasStartedPollingRef.current = false;
    pollCountRef.current = 0;
  };

  return {
    pollingRef,
    startPolling,
    stopPolling,
    resetPolling,
  };
}
