'use client';

import { useCallback, useRef } from 'react';

interface UseLongPressDetectionProps {
  isSelectionMode: boolean;
  onStartLongPress?: () => void;
  onCancelLongPress?: () => void;
  onEnterSelectionMode?: () => void;
}

export function useLongPressDetection({
  isSelectionMode,
  onStartLongPress,
  onCancelLongPress,
  onEnterSelectionMode,
}: UseLongPressDetectionProps) {
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);

  const startLongPressTimer = useCallback(
    (onLongPress: () => void) => {
      if (isSelectionMode) return;
      onStartLongPress?.();
      longPressTimerRef.current = setTimeout(() => {
        onLongPress();
        longPressTimerRef.current = null;
      }, 500);
    },
    [isSelectionMode, onStartLongPress],
  );

  const cancelLongPressTimer = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
      onCancelLongPress?.();
    }
  }, [onCancelLongPress]);

  return {
    startLongPressTimer,
    cancelLongPressTimer,
  };
}

