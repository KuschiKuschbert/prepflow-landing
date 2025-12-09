/**
 * Hook for managing polling logic.
 */

import { logger } from '@/lib/logger';
import { useCallback, useRef } from 'react';

const MAX_POLLS = 60; // Poll for up to 2 minutes (60 * 2 seconds)
const POLL_INTERVAL = 2000; // Poll every 2 seconds

export function usePolling() {
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const hasStartedPollingRef = useRef(false);
  const pollCountRef = useRef(0);

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
      hasStartedPollingRef.current = false;
      pollCountRef.current = 0;
    }
  }, []);

  const startPolling = useCallback(
    (fetchFn: () => Promise<void>) => {
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
    },
    [stopPolling],
  );

  const resetPolling = useCallback(() => {
    stopPolling();
    hasStartedPollingRef.current = false;
    pollCountRef.current = 0;
  }, [stopPolling]);

  return {
    pollingRef,
    startPolling,
    stopPolling,
    resetPolling,
  };
}
