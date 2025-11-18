/**
 * Hook for tracking time spent on pages.
 */

import { useEffect, useRef } from 'react';
import { updateTimeSpentForLastLog } from './timeTracking';
import type { PendingLog } from './logStorage';

/**
 * Hook for tracking time spent on pages.
 *
 * @param {React.MutableRefObject<PendingLog[]>} pendingLogsRef - Reference to pending logs
 * @param {React.MutableRefObject<number>} pageStartTimeRef - Reference to page start time
 * @param {React.MutableRefObject<string | null>} previousPathRef - Reference to previous path
 * @param {Function} syncPendingLogs - Function to sync logs
 */
export function useTimeTracking(
  pendingLogsRef: React.MutableRefObject<PendingLog[]>,
  pageStartTimeRef: React.MutableRefObject<number>,
  previousPathRef: React.MutableRefObject<string | null>,
  syncPendingLogs: (isUnload: boolean) => Promise<void>,
) {
  // Track page visibility for time spent calculation
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page hidden, calculate time spent
        const timeSpent = Date.now() - pageStartTimeRef.current;
        if (previousPathRef.current && timeSpent > 1000) {
          // Only track if user spent more than 1 second on page
          updateTimeSpentForLastLog(pendingLogsRef.current, previousPathRef.current, timeSpent);
        }
      } else {
        // Page visible, reset start time
        pageStartTimeRef.current = Date.now();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [pendingLogsRef, pageStartTimeRef, previousPathRef]);

  // Track page unload for final time spent
  useEffect(() => {
    const handleBeforeUnload = () => {
      const timeSpent = Date.now() - pageStartTimeRef.current;
      if (previousPathRef.current && timeSpent > 1000) {
        updateTimeSpentForLastLog(pendingLogsRef.current, previousPathRef.current, timeSpent);
      }
      syncPendingLogs(true); // Sync on unload
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [pendingLogsRef, pageStartTimeRef, previousPathRef, syncPendingLogs]);
}
