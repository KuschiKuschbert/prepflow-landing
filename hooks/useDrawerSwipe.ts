import { useEffect, useRef, useState } from 'react';
import {
  calculateDragProgress,
  handleDownwardGestureAtTop,
  handleUpwardGestureAtTop,
} from './useDrawerSwipe.utils';

interface UseDrawerSwipeOptions {
  isOpen: boolean;
  onClose: () => void;
  threshold?: number;
  velocityThreshold?: number;
  contentTopDragArea?: number;
}

interface UseDrawerSwipeReturn {
  dragY: number;
  isDragging: boolean;
  canDrag: boolean;
  drawerRef: React.RefObject<HTMLDivElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
  handleHandleTouchStart: (e: React.TouchEvent) => void;
  handleContentTouchStart: (e: React.TouchEvent) => void;
  handleTouchMove: (e: React.TouchEvent) => void;
  handleTouchEnd: () => void;
  handleDrawerTouchStart: (e: React.TouchEvent) => void;
  // Visual feedback state
  isAtTop: boolean;
  upwardMovement: number;
  dragProgress: number; // 0-1, progress toward close threshold
}

export function useDrawerSwipe({
  isOpen,
  onClose,
  threshold = 0.25,
  velocityThreshold = 0.3,
  contentTopDragArea = 100,
}: UseDrawerSwipeOptions): UseDrawerSwipeReturn {
  const drawerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [lastY, setLastY] = useState(0);
  const [lastTime, setLastTime] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const [canDrag, setCanDrag] = useState(false);
  const maxUpwardMovementRef = useRef(0);
  const [isAtTop, setIsAtTop] = useState(false);
  const [upwardMovement, setUpwardMovement] = useState(0);
  const [dragProgress, setDragProgress] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setDragY(0);
      setIsDragging(false);
      setVelocity(0);
      setCanDrag(false);
      maxUpwardMovementRef.current = 0;
      setIsAtTop(false);
      setUpwardMovement(0);
      setDragProgress(0);
    } else if (contentRef.current) {
      setIsAtTop(contentRef.current.scrollTop <= 5);
    }
  }, [isOpen]);

  // Update isAtTop on scroll
  useEffect(() => {
    if (!isOpen || !contentRef.current) return;

    const handleScroll = () => {
      if (contentRef.current) {
        setIsAtTop(contentRef.current.scrollTop <= 5);
      }
    };

    const content = contentRef.current;
    content.addEventListener('scroll', handleScroll, { passive: true });
    return () => content.removeEventListener('scroll', handleScroll);
  }, [isOpen]);

  const startDrag = (touchY: number) => {
    const now = Date.now();
    setStartY(touchY);
    setLastY(touchY);
    setLastTime(now);
    setIsDragging(true);
    setCanDrag(true);
    setVelocity(0);
    setDragY(0);
  };

  const handleHandleTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    if (!drawerRef.current) return;
    startDrag(e.touches[0].clientY);
  };

  const handleContentTouchStart = (e: React.TouchEvent) => {
    if (!contentRef.current || !drawerRef.current) return;
    const atTop = contentRef.current.scrollTop <= 5;
    const touchY = e.touches[0].clientY;
    const drawerRect = drawerRef.current.getBoundingClientRect();
    const touchRelativeToDrawer = touchY - drawerRect.top;
    const now = Date.now();

    setStartY(touchY);
    setLastY(touchY);
    setLastTime(now);
    maxUpwardMovementRef.current = 0;
    setIsAtTop(atTop);
    setUpwardMovement(0);
    setDragProgress(0);

    // When at top, enable gesture detection everywhere
    if (atTop) {
      setIsDragging(true);
      setCanDrag(true);
      setDragY(0);
      setVelocity(0);
    } else {
      const inDragArea = touchRelativeToDrawer < contentTopDragArea;
      setIsDragging(inDragArea);
      setCanDrag(inDragArea);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!contentRef.current || !drawerRef.current) return;

    const currentY = e.touches[0].clientY;
    const currentTime = Date.now();
    const atTop = contentRef.current.scrollTop <= 5;
    const deltaY = currentY - startY;
    const absDeltaY = Math.abs(deltaY);

    setLastY(currentY);
    setLastTime(currentTime);
    setIsAtTop(atTop);

    // When at top, detect both upward (close) and downward (swipe down) gestures
    if (atTop && isDragging) {
      if (deltaY < -5) {
        // Upward gesture - use utility function
        const result = handleUpwardGestureAtTop({
          deltaY,
          absDeltaY,
          maxUpwardMovementRef,
          onClose,
        });
        setUpwardMovement(result.upwardMovement);
        setDragProgress(result.progress);
        setDragY(0);
        setVelocity(0);
        if (result.upwardMovement > 10) {
          e.preventDefault();
          e.stopPropagation();
        }
        if (result.shouldClose) {
          setIsDragging(false);
          setCanDrag(false);
          maxUpwardMovementRef.current = 0;
          setUpwardMovement(0);
          setDragProgress(0);
          return;
        }
      } else if (deltaY > 10 && drawerRef.current) {
        // Downward gesture when at top - use utility function
        const drawerHeight = drawerRef.current.offsetHeight;
        const result = handleDownwardGestureAtTop({
          deltaY,
          drawerHeight,
          threshold,
          lastTime,
          currentY,
          lastY,
          currentTime,
        });
        setUpwardMovement(0);
        setDragY(deltaY);
        setDragProgress(result.progress);
        setVelocity(result.velocity);
        if (result.shouldPreventDefault) {
          e.preventDefault();
          e.stopPropagation();
        }
      } else {
        // Small movement - allow scrolling
        setUpwardMovement(0);
        setDragProgress(0);
        setDragY(0);
        setVelocity(0);
      }
    } else {
      // Not at top - handle downward swipe normally
      setUpwardMovement(0);
      if (isDragging && canDrag && deltaY > 5 && drawerRef.current) {
        setDragY(deltaY);
        const drawerHeight = drawerRef.current.offsetHeight;
        setDragProgress(calculateDragProgress({ deltaY, drawerHeight, threshold }));
        if (lastTime > 0) {
          const timeDelta = currentTime - lastTime;
          if (timeDelta > 0) setVelocity(Math.abs((currentY - lastY) / timeDelta));
        }
        e.preventDefault();
        e.stopPropagation();
      } else if (isDragging && canDrag && deltaY < -5) {
        setCanDrag(false);
        setIsDragging(false);
        setDragY(0);
        setVelocity(0);
        setDragProgress(0);
      } else if (!isDragging || !canDrag) {
        setDragProgress(0);
      }
    }
  };

  const handleTouchEnd = () => {
    if (!contentRef.current) {
      setIsDragging(false);
      setCanDrag(false);
      setVelocity(0);
      maxUpwardMovementRef.current = 0;
      return;
    }
    const isAtTop = contentRef.current.scrollTop <= 5;
    // Close on upward gesture at top
    if (isAtTop && isDragging && maxUpwardMovementRef.current > 15) {
      onClose();
      setIsDragging(false);
      setCanDrag(false);
      setDragY(0);
      setVelocity(0);
      maxUpwardMovementRef.current = 0;
      return;
    }
    maxUpwardMovementRef.current = 0;
    setUpwardMovement(0);
    // Handle downward swipe end
    if (!isDragging || !drawerRef.current) {
      setIsDragging(false);
      setCanDrag(false);
      setVelocity(0);
      setDragProgress(0);
      return;
    }
    // Close on downward drag when at top or in drag area
    if (dragY > 0 && (canDrag || isAtTop)) {
      const drawerHeight = drawerRef.current.offsetHeight;
      if (dragY > drawerHeight * threshold || velocity > velocityThreshold) {
        onClose();
      } else {
        setDragY(0);
      }
    } else {
      setDragY(0);
    }
    setIsDragging(false);
    setCanDrag(false);
    setVelocity(0);
    setDragProgress(0);
  };

  const handleDrawerTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
  };

  return {
    dragY,
    isDragging,
    canDrag,
    drawerRef,
    contentRef,
    handleHandleTouchStart,
    handleContentTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleDrawerTouchStart,
    isAtTop,
    upwardMovement,
    dragProgress,
  };
}
