// PrepFlow Adaptive Navigation Optimization - Navigation Tracking Hook

'use client';

import { useEffect, useRef, useCallback } from 'react';
import { getAdaptiveNavSettings } from '@/lib/navigation-optimization/store';
import { saveUsageLog } from '@/lib/navigation-optimization/localStorage';
import {
  loadPendingLogs,
  savePendingLogs,
  type PendingLog,
} from './useNavigationTracking/logStorage';
import {
  loadVisitCounts,
  saveVisitCounts,
  calculateReturnFrequency,
} from './useNavigationTracking/visitCounts';
import { syncPendingLogs } from './useNavigationTracking/logSync';
import { useLogSync } from './useNavigationTracking/useLogSync';
import { useTimeTracking } from './useNavigationTracking/useTimeTracking';

const MAX_LOCAL_LOGS = 1000; // Keep last 1000 logs locally

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
  const pageStartTimeRef = useRef<number>(Date.now());
  const previousPathRef = useRef<string | null>(null);
  const pendingLogsRef = useRef<PendingLog[]>([]);
  const visitCountsRef = useRef<Map<string, number>>(new Map());

  // Load pending logs and visit counts on mount
  useEffect(() => {
    pendingLogsRef.current = loadPendingLogs();
    visitCountsRef.current = loadVisitCounts();
  }, []);

  // Sync wrapper function
  const syncPendingLogsWrapper = useCallback(async (isUnload = false) => {
    await syncPendingLogs(pendingLogsRef.current, isUnload);
  }, []);

  // Set up periodic sync
  useLogSync(pendingLogsRef);

  // Set up time tracking
  useTimeTracking(pendingLogsRef, pageStartTimeRef, previousPathRef, syncPendingLogsWrapper);

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
      saveVisitCounts(visitCountsRef.current);

      // Calculate return frequency
      const returnFrequency = calculateReturnFrequency(href, visitCountsRef.current);

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
      savePendingLogs(pendingLogsRef.current);
      saveUsageLog(logEntry); // Also save to usage logs for pattern analysis

      // Update previous path and reset start time
      previousPathRef.current = href;
      pageStartTimeRef.current = Date.now();

      // Sync immediately (non-blocking)
      syncPendingLogsWrapper(false).catch(() => {
        // Ignore errors, will retry on next sync
      });
    },
    [syncPendingLogsWrapper],
  );

  return {
    trackNavigation,
  };
}
