/**
 * Hook for setting up periodic log syncing.
 */

import { useEffect, useRef } from 'react';
import { syncPendingLogs } from './logSync';
import type { PendingLog } from './logStorage';

const SYNC_INTERVAL = 5 * 60 * 1000; // 5 minutes

/**
 * Hook for setting up periodic log syncing.
 *
 * @param {React.MutableRefObject<PendingLog[]>} pendingLogsRef - Reference to pending logs
 */
export function useLogSync(pendingLogsRef: React.MutableRefObject<PendingLog[]>) {
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (syncIntervalRef.current) {
      clearInterval(syncIntervalRef.current);
    }

    syncIntervalRef.current = setInterval(() => {
      syncPendingLogs(pendingLogsRef.current, false);
    }, SYNC_INTERVAL);

    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }
    };
  }, [pendingLogsRef]);
}
