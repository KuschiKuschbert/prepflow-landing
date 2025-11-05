'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Session Timeout Hook
 *
 * Monitors user activity and triggers warnings/logout after inactivity.
 * Optimized for kitchen management tools with 4-hour timeout.
 */

// Default timeout: 4 hours (14,400,000ms)
const DEFAULT_TIMEOUT_MS = 4 * 60 * 60 * 1000;
// Default warning: 15 minutes before timeout (900,000ms)
const DEFAULT_WARNING_MS = 15 * 60 * 1000;

interface UseSessionTimeoutOptions {
  timeoutMs?: number;
  warningMs?: number;
  onTimeout?: () => void;
  onWarning?: (remainingMs: number) => void;
  enabled?: boolean;
}

interface UseSessionTimeoutReturn {
  isWarning: boolean;
  remainingMs: number | null;
  resetTimeout: () => void;
}

export const useSessionTimeout = ({
  timeoutMs = DEFAULT_TIMEOUT_MS,
  warningMs = DEFAULT_WARNING_MS,
  onTimeout,
  onWarning,
  enabled = true,
}: UseSessionTimeoutOptions = {}): UseSessionTimeoutReturn => {
  const [isWarning, setIsWarning] = useState(false);
  const [remainingMs, setRemainingMs] = useState<number | null>(null);

  const lastActivityRef = useRef<number>(Date.now());
  const warningTimerRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimers = useCallback(() => {
    if (warningTimerRef.current) {
      clearTimeout(warningTimerRef.current);
      warningTimerRef.current = null;
    }
    if (timeoutTimerRef.current) {
      clearTimeout(timeoutTimerRef.current);
      timeoutTimerRef.current = null;
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
  }, []);

  const resetTimeout = useCallback(() => {
    if (!enabled) return;

    // Clear existing timers
    clearTimers();
    setIsWarning(false);
    setRemainingMs(null);

    // Update last activity time
    lastActivityRef.current = Date.now();

    // Set warning timer (fires at timeoutMs - warningMs)
    const warningTime = timeoutMs - warningMs;
    warningTimerRef.current = setTimeout(() => {
      setIsWarning(true);
      setRemainingMs(warningMs);

      // Start countdown interval
      countdownIntervalRef.current = setInterval(() => {
        const elapsed = Date.now() - (lastActivityRef.current + warningTime);
        const remaining = Math.max(0, warningMs - elapsed);
        setRemainingMs(remaining);

        if (remaining <= 0) {
          clearInterval(countdownIntervalRef.current!);
          countdownIntervalRef.current = null;
        }
      }, 1000); // Update every second

      // Call onWarning callback
      if (onWarning) {
        onWarning(warningMs);
      }
    }, warningTime);

    // Set timeout timer (fires at timeoutMs)
    timeoutTimerRef.current = setTimeout(() => {
      clearTimers();
      setIsWarning(false);
      setRemainingMs(null);

      // Call onTimeout callback
      if (onTimeout) {
        onTimeout();
      }
    }, timeoutMs);
  }, [enabled, timeoutMs, warningMs, onTimeout, onWarning, clearTimers]);

  // Track user activity
  useEffect(() => {
    if (!enabled) return;

    const activityEvents = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click',
      'focus',
    ];

    const handleActivity = () => {
      // Reset timeout on any activity (user interaction dismisses warning automatically)
      resetTimeout();
    };

    // Add event listeners
    activityEvents.forEach(event => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    // Initial timeout setup
    resetTimeout();

    // Cleanup
    return () => {
      activityEvents.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
      clearTimers();
    };
  }, [enabled, resetTimeout, clearTimers]);

  // Handle tab visibility changes (pause timer when tab is hidden)
  useEffect(() => {
    if (!enabled) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab is hidden - pause timers (optional for 4-hour timeout)
        // For shorter timeouts, you might want to pause
        // For 4-hour timeout, we'll let it continue
      } else {
        // Tab is visible - resume/reset timeout
        resetTimeout();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [enabled, resetTimeout]);

  return {
    isWarning,
    remainingMs,
    resetTimeout,
  };
};
