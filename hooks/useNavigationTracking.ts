// PrepFlow Adaptive Navigation Optimization - Navigation Tracking Hook

'use client';

import { useCallback, useEffect, useRef } from 'react';
import { createTrackNavigationHandler } from './useNavigationTracking/helpers/trackNavigation';
import {
    loadPendingLogs,
    type PendingLog
} from './useNavigationTracking/logStorage';
import { useLogSync } from './useNavigationTracking/useLogSync';
import { useTimeTracking } from './useNavigationTracking/useTimeTracking';
import {
    loadVisitCounts
} from './useNavigationTracking/visitCounts';

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

  const trackNavigation = useCallback(createTrackNavigationHandler(pendingLogsRef, visitCountsRef, previousPathRef, pageStartTimeRef, syncPendingLogsWrapper), [syncPendingLogsWrapper]);

  return {
    trackNavigation,
  };
}
