'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
const DEFAULT_TIMEOUT_MS = 4 * 60 * 60 * 1000;
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
    clearTimers();
    setIsWarning(false);
    setRemainingMs(null);
    lastActivityRef.current = Date.now();
    const warningTime = timeoutMs - warningMs;
    warningTimerRef.current = setTimeout(() => {
      setIsWarning(true);
      setRemainingMs(warningMs);
      countdownIntervalRef.current = setInterval(() => {
        const elapsed = Date.now() - (lastActivityRef.current + warningTime);
        const remaining = Math.max(0, warningMs - elapsed);
        setRemainingMs(remaining);
        if (remaining <= 0) {
          clearInterval(countdownIntervalRef.current!);
          countdownIntervalRef.current = null;
        }
      }, 1000);
      if (onWarning) onWarning(warningMs);
    }, warningTime);
    timeoutTimerRef.current = setTimeout(() => {
      clearTimers();
      setIsWarning(false);
      setRemainingMs(null);
      if (onTimeout) onTimeout();
    }, timeoutMs);
  }, [enabled, timeoutMs, warningMs, onTimeout, onWarning, clearTimers]);

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
    const handleActivity = () => resetTimeout();
    activityEvents.forEach(event =>
      document.addEventListener(event, handleActivity, { passive: true }),
    );
    resetTimeout();
    return () => {
      activityEvents.forEach(event => document.removeEventListener(event, handleActivity));
      clearTimers();
    };
  }, [enabled, resetTimeout, clearTimers]);
  useEffect(() => {
    if (!enabled) return;
    const handleVisibilityChange = () => {
      if (!document.hidden) resetTimeout();
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [enabled, resetTimeout]);
  return { isWarning, remainingMs, resetTimeout };
};
