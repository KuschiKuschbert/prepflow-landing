import { useEffect, useRef, useState } from 'react';

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

  useEffect(() => {
    if (!isOpen) {
      setDragY(0);
      setIsDragging(false);
      setVelocity(0);
      setCanDrag(false);
    }
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
    const isAtTop = contentRef.current.scrollTop <= 5;
    const touchY = e.touches[0].clientY;
    const drawerRect = drawerRef.current.getBoundingClientRect();
    if (isAtTop && touchY - drawerRect.top < contentTopDragArea) {
      startDrag(touchY);
    } else {
      setCanDrag(false);
      setIsDragging(false);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !canDrag || !drawerRef.current) return;
    const currentY = e.touches[0].clientY;
    const currentTime = Date.now();
    const deltaY = currentY - startY;
    if (deltaY > 5) {
      e.preventDefault();
      e.stopPropagation();
      setDragY(deltaY);
      if (lastTime > 0) {
        const timeDelta = currentTime - lastTime;
        if (timeDelta > 0) setVelocity(Math.abs((currentY - lastY) / timeDelta));
      }
      setLastY(currentY);
      setLastTime(currentTime);
    } else if (deltaY < -5) {
      setCanDrag(false);
      setIsDragging(false);
      setDragY(0);
      setVelocity(0);
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging || !drawerRef.current || !canDrag || dragY <= 0) {
      setIsDragging(false);
      setCanDrag(false);
      setVelocity(0);
      return;
    }
    const drawerHeight = drawerRef.current.offsetHeight;
    if (dragY > drawerHeight * threshold || velocity > velocityThreshold) {
      onClose();
    } else {
      setDragY(0);
    }
    setIsDragging(false);
    setCanDrag(false);
    setVelocity(0);
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
  };
}
