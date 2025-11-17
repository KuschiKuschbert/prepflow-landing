// PrepFlow Adaptive Navigation Optimization - Navigation Tracking Hook

'use client';

import { useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { getAdaptiveNavSettings } from '@/lib/navigation-optimization/store';
import { type NavigationUsageLog } from '@/lib/navigation-optimization/schema';
import { logger } from '@/lib/logger';
import { saveUsageLog } from '@/lib/navigation-optimization/localStorage';

const STORAGE_KEY = 'prepflow-nav-pending-logs'; // Different key for pending (unsynced) logs
const SYNC_INTERVAL = 5 * 60 * 1000; // 5 minutes
const MAX_LOCAL_LOGS = 1000; // Keep last 1000 logs locally

interface PendingLog extends NavigationUsageLog {
  synced?: boolean;
}

/**
 * Hook to track navigation usage for adaptive optimization.
 *
 * @returns {Object} Navigation tracking utilities
 * @returns {Function} returns.trackNavigation - Function to track navigation click
 *
 * @example
 * ```typescript
 * const { trackNavigation } = useNavigationTracking();
 * trackNavigation('/webapp/recipes');
 * ```
 */
export function useNavigationTracking() {
  const pathname = usePathname();
  const pageStartTimeRef = useRef<number>(Date.now());
  const previousPathRef = useRef<string | null>(null);
  const pendingLogsRef = useRef<PendingLog[]>([]);
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const visitCountsRef = useRef<Map<string, number>>(new Map());

  // Calculate return frequency (visits per week)
  const calculateReturnFrequency = useCallback((href: string): number => {
    const count = visitCountsRef.current.get(href) || 0;
    // Simple calculation: assume visits are spread over a week
    // More sophisticated calculation could use actual timestamps
    return Math.min(count, 7); // Cap at 7 visits per week
  }, []);

  // Save pending logs to localStorage
  const savePendingLogs = useCallback(() => {
    if (typeof window === 'undefined') return;
    try {
      const logsToSave = pendingLogsRef.current.slice(-MAX_LOCAL_LOGS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(logsToSave));
    } catch {
      // Storage quota exceeded, ignore
    }
  }, []);

  // Sync pending logs to server
  const syncPendingLogs = useCallback(
    async (isUnload = false) => {
      const settings = getAdaptiveNavSettings();
      if (!settings.enabled) {
        return; // Don't sync if feature is disabled
      }

      const logsToSync = pendingLogsRef.current.filter(log => !log.synced);
      if (logsToSync.length === 0) {
        return;
      }

      // Sync logs one at a time (to avoid overwhelming the server)
      for (const log of logsToSync) {
        try {
          const response = await fetch('/api/navigation-optimization/log', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(log),
          });

          if (response.ok) {
            log.synced = true;
          } else if (!isUnload) {
            // Don't log errors on unload
            logger.error('[Navigation Tracking] Failed to sync log:', {
              status: response.status,
              href: log.href,
            });
            // Stop syncing on error to avoid spam
            break;
          }
        } catch (error) {
          if (!isUnload) {
            logger.error('[Navigation Tracking] Error syncing log:', {
              error: error instanceof Error ? error.message : String(error),
              href: log.href,
            });
          }
          // Stop syncing on error to avoid spam
          break;
        }
      }

      // Remove synced logs and save
      pendingLogsRef.current = pendingLogsRef.current.filter(log => !log.synced);
      savePendingLogs();
    },
    [savePendingLogs],
  );

  // Update time spent for the last log entry for a given href
  const updateTimeSpentForLastLog = useCallback(
    (href: string, timeSpent: number) => {
      const logs = pendingLogsRef.current;
      // Find the most recent log for this href
      for (let i = logs.length - 1; i >= 0; i--) {
        if (logs[i].href === href && !logs[i].synced) {
          logs[i].timeSpent = timeSpent;
          savePendingLogs();
          break;
        }
      }
    },
    [savePendingLogs],
  );

  // Load pending logs from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const logs = JSON.parse(stored) as PendingLog[];
        pendingLogsRef.current = logs.filter(log => !log.synced).slice(-MAX_LOCAL_LOGS);
      }
    } catch {
      // Invalid stored data, start fresh
    }

    // Load visit counts
    try {
      const visitCountsStored = localStorage.getItem(`${STORAGE_KEY}-visits`);
      if (visitCountsStored) {
        const counts = JSON.parse(visitCountsStored) as Record<string, number>;
        visitCountsRef.current = new Map(Object.entries(counts));
      }
    } catch {
      // Invalid stored data, start fresh
    }
  }, []);

  // Track page visibility for time spent calculation
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page hidden, calculate time spent
        const timeSpent = Date.now() - pageStartTimeRef.current;
        if (previousPathRef.current && timeSpent > 1000) {
          // Only track if user spent more than 1 second on page
          updateTimeSpentForLastLog(previousPathRef.current, timeSpent);
        }
      } else {
        // Page visible, reset start time
        pageStartTimeRef.current = Date.now();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [updateTimeSpentForLastLog]);

  // Track page unload for final time spent
  useEffect(() => {
    const handleBeforeUnload = () => {
      const timeSpent = Date.now() - pageStartTimeRef.current;
      if (previousPathRef.current && timeSpent > 1000) {
        updateTimeSpentForLastLog(previousPathRef.current, timeSpent);
      }
      syncPendingLogs(true); // Sync on unload
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [updateTimeSpentForLastLog, syncPendingLogs]);

  // Set up periodic sync
  useEffect(() => {
    if (syncIntervalRef.current) {
      clearInterval(syncIntervalRef.current);
    }

    syncIntervalRef.current = setInterval(() => {
      syncPendingLogs(false);
    }, SYNC_INTERVAL);

    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }
    };
  }, [syncPendingLogs]);

  // Track navigation click
  const trackNavigation = useCallback(
    (href: string) => {
      const settings = getAdaptiveNavSettings();
      if (!settings.enabled) {
        return; // Don't track if feature is disabled
      }

      const now = new Date();
      const dayOfWeek = now.getDay(); // 0-6 (Sunday = 0)
      const hourOfDay = now.getHours(); // 0-23

      // Update visit count
      const currentCount = visitCountsRef.current.get(href) || 0;
      visitCountsRef.current.set(href, currentCount + 1);

      // Save visit counts
      try {
        const countsObj = Object.fromEntries(visitCountsRef.current);
        localStorage.setItem(`${STORAGE_KEY}-visits`, JSON.stringify(countsObj));
      } catch {
        // Storage quota exceeded, ignore
      }

      // Calculate return frequency
      const returnFrequency = calculateReturnFrequency(href);

      // Create log entry
      const logEntry: PendingLog = {
        href,
        timestamp: now.getTime(),
        dayOfWeek,
        hourOfDay,
        returnFrequency,
        synced: false,
      };

      // Add to pending logs
      pendingLogsRef.current.push(logEntry);
      if (pendingLogsRef.current.length > MAX_LOCAL_LOGS) {
        pendingLogsRef.current = pendingLogsRef.current.slice(-MAX_LOCAL_LOGS);
      }

      // Save to localStorage immediately (both pending and usage logs)
      savePendingLogs();
      saveUsageLog(logEntry); // Also save to usage logs for pattern analysis

      // Update previous path and reset start time
      previousPathRef.current = href;
      pageStartTimeRef.current = Date.now();

      // Sync immediately (non-blocking)
      syncPendingLogs(false).catch(() => {
        // Ignore errors, will retry on next sync
      });
    },
    [calculateReturnFrequency, savePendingLogs, syncPendingLogs],
  );

  return {
    trackNavigation,
  };
}
