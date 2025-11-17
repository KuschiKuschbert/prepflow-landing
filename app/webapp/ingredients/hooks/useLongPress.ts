'use client';

import { useRef } from 'react';

interface UseLongPressOptions {
  onLongPress: () => void;
  onCancel?: () => void;
  delay?: number;
}

export function useLongPress({ onLongPress, onCancel, delay = 500 }: UseLongPressOptions) {
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartTimeRef = useRef<number | null>(null);
  const touchStartPosRef = useRef<{ x: number; y: number } | null>(null);
  const hasMovedRef = useRef(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartTimeRef.current = Date.now();
    touchStartPosRef.current = { x: touch.clientX, y: touch.clientY };
    hasMovedRef.current = false;

    longPressTimerRef.current = setTimeout(() => {
      if (!hasMovedRef.current) {
        onLongPress();
      }
    }, delay);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartPosRef.current) return;

    const touch = e.touches[0];
    const deltaX = Math.abs(touch.clientX - touchStartPosRef.current.x);
    const deltaY = Math.abs(touch.clientY - touchStartPosRef.current.y);

    if (deltaX > 10 || deltaY > 10) {
      hasMovedRef.current = true;
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
      }
      if (onCancel) {
        onCancel();
      }
    }
  };

  const handleTouchEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    if (hasMovedRef.current && onCancel) {
      onCancel();
    }
    touchStartTimeRef.current = null;
    touchStartPosRef.current = null;
    hasMovedRef.current = false;
  };

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  };
}
