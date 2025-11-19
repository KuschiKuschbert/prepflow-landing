import { useState } from 'react';

interface UseDrawerSwipeHandlersProps {
  isOpen: boolean;
  onClose: () => void;
}

export function useDrawerSwipeHandlers({ isOpen, onClose }: UseDrawerSwipeHandlersProps) {
  const minSwipeDistance = 100; // Increased threshold to prevent accidental closes
  const [isSwiping, setIsSwiping] = useState(false);
  const [swipeStartY, setSwipeStartY] = useState<number | null>(null);
  const [swipeStartX, setSwipeStartX] = useState<number | null>(null);

  const handleHeaderTouchStart = (e: React.TouchEvent) => {
    // Only allow swipe-to-close from the header area
    setSwipeStartY(e.targetTouches[0].clientY);
    setSwipeStartX(e.targetTouches[0].clientX);
    setIsSwiping(true);
  };

  const handleHeaderTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping || swipeStartY === null || swipeStartX === null) return;

    const currentY = e.targetTouches[0].clientY;
    const currentX = e.targetTouches[0].clientX;
    const deltaY = currentY - swipeStartY;
    const deltaX = Math.abs(currentX - swipeStartX);

    // Only allow swipe if it's primarily vertical (not horizontal scrolling)
    // And only if swiping down
    if (deltaY > 0 && deltaY > deltaX * 1.5) {
      // Allow the swipe to continue
      e.preventDefault();
    } else {
      // Cancel swipe detection if it's horizontal or upward
      setIsSwiping(false);
    }
  };

  const handleHeaderTouchEnd = (e: React.TouchEvent) => {
    if (!isSwiping || swipeStartY === null) {
      setIsSwiping(false);
      setSwipeStartY(null);
      setSwipeStartX(null);
      return;
    }

    const endY = e.changedTouches[0].clientY;
    const distance = swipeStartY - endY;
    const isDownSwipe = distance > minSwipeDistance;

    if (isDownSwipe && isOpen) {
      onClose();
    }

    setIsSwiping(false);
    setSwipeStartY(null);
    setSwipeStartX(null);
  };

  return {
    handleHeaderTouchStart,
    handleHeaderTouchMove,
    handleHeaderTouchEnd,
  };
}

