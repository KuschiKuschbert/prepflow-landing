'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

const LONG_PRESS_DURATION = 500; // 500ms for long press

export function useSelectionMode() {
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartTimeRef = useRef<number | null>(null);

  const startLongPress = useCallback(() => {
    touchStartTimeRef.current = Date.now();
    longPressTimerRef.current = setTimeout(() => {
      setIsSelectionMode(true);
      longPressTimerRef.current = null;
    }, LONG_PRESS_DURATION);
  }, []);

  const cancelLongPress = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    touchStartTimeRef.current = null;
  }, []);

  const enterSelectionMode = useCallback(() => {
    setIsSelectionMode(true);
    cancelLongPress();
  }, [cancelLongPress]);

  const exitSelectionMode = useCallback(() => {
    setIsSelectionMode(false);
    cancelLongPress();
  }, [cancelLongPress]);

  // Exit selection mode when clicking outside (on desktop)
  useEffect(() => {
    if (!isSelectionMode) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Don't exit if clicking on table rows or selection controls
      if (
        target.closest('tr') ||
        target.closest('button[aria-label*="Select"]') ||
        target.closest('button[aria-label*="Deselect"]')
      ) {
        return;
      }
      exitSelectionMode();
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isSelectionMode, exitSelectionMode]);

  // Note: Removed auto-exit on scroll to allow scrolling while selecting multiple items
  // Users can exit selection mode manually using the "Done" button

  return {
    isSelectionMode,
    startLongPress,
    cancelLongPress,
    enterSelectionMode,
    exitSelectionMode,
  };
}

