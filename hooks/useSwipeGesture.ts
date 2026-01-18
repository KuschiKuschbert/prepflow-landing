'use client';
import { useCallback, useRef, useState } from 'react';
interface UseSwipeGestureOptions {
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number; // Minimum distance in pixels to trigger swipe
  velocityThreshold?: number; // Minimum velocity to trigger swipe
}

interface UseSwipeGestureReturn {
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: (e?: React.TouchEvent) => void;
  isSwiping: boolean;
  swipeDistance: number;
}
export function useSwipeGesture({
  onSwipeUp,
  onSwipeDown,
  threshold = 50,
  velocityThreshold = 0.3,
}: UseSwipeGestureOptions = {}): UseSwipeGestureReturn {
  const [isSwiping, setIsSwiping] = useState(false);
  const [swipeDistance, setSwipeDistance] = useState(0);
  const startY = useRef(0);
  const startTime = useRef(0);
  const lastY = useRef(0);
  const lastTime = useRef(0);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    startY.current = touch.clientY;
    startTime.current = Date.now();
    lastY.current = touch.clientY;
    lastTime.current = Date.now();
    setIsSwiping(true);
    setSwipeDistance(0);
  }, []);

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isSwiping) return;
      const touch = e.touches[0];
      const currentY = touch.clientY;
      const currentTime = Date.now();
      const deltaY = startY.current - currentY;
      setSwipeDistance(deltaY);
      const timeDelta = currentTime - lastTime.current;
      if (timeDelta > 0) {
        const _yDelta = Math.abs(currentY - lastY.current);
        lastY.current = currentY;
        lastTime.current = currentTime;
      }
    },
    [isSwiping],
  );

  const onTouchEnd = useCallback(
    (e?: React.TouchEvent) => {
      if (!isSwiping) return;
      const endY = e?.changedTouches[0]?.clientY ?? lastY.current;
      const endTime = Date.now();
      const timeDelta = endTime - startTime.current;
      const distance = startY.current - endY;
      const velocity = Math.abs(distance) / (timeDelta || 1);
      const meetsDistanceThreshold = Math.abs(distance) >= threshold;
      const meetsVelocityThreshold = velocity >= velocityThreshold;
      if (meetsDistanceThreshold || meetsVelocityThreshold) {
        if (distance > 0 && onSwipeUp) onSwipeUp();
        else if (distance < 0 && onSwipeDown) onSwipeDown();
      }
      setIsSwiping(false);
      setSwipeDistance(0);
    },
    [isSwiping, threshold, velocityThreshold, onSwipeUp, onSwipeDown],
  );
  return { onTouchStart, onTouchMove, onTouchEnd, isSwiping, swipeDistance };
}
