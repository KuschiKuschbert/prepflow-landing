'use client';

import { useCallback, useRef } from 'react';

export function useTouchPositionTracking() {
  const touchStartTimeRef = useRef<number | null>(null);
  const touchStartPosRef = useRef<{ x: number; y: number } | null>(null);
  const hasMovedRef = useRef(false);

  const recordTouchStart = useCallback((touch: Touch) => {
    touchStartPosRef.current = { x: touch.clientX, y: touch.clientY };
    touchStartTimeRef.current = Date.now();
    hasMovedRef.current = false;
  }, []);

  const checkMovement = useCallback((touch: Touch): boolean => {
    if (!touchStartPosRef.current) return false;
    const moveDistance =
      Math.abs(touch.clientX - touchStartPosRef.current.x) +
      Math.abs(touch.clientY - touchStartPosRef.current.y);
    if (moveDistance > 10) {
      hasMovedRef.current = true;
      return true;
    }
    return false;
  }, []);

  const getTouchDuration = useCallback((): number | null => {
    if (!touchStartTimeRef.current) return null;
    return Date.now() - touchStartTimeRef.current;
  }, []);

  const resetTracking = useCallback(() => {
    touchStartTimeRef.current = null;
    touchStartPosRef.current = null;
    hasMovedRef.current = false;
  }, []);

  const hasMoved = useCallback(() => {
    return hasMovedRef.current;
  }, []);

  return {
    recordTouchStart,
    checkMovement,
    getTouchDuration,
    resetTracking,
    hasMoved,
  };
}
