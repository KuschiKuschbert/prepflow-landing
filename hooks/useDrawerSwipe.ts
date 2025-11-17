import { useCallback, useRef } from 'react';
import { useDrawerState } from './utils/drawerStateManagement';
import { handleTouchMoveLogic } from './utils/drawerTouchMoveHandler';
import { handleTouchEndLogic } from './utils/drawerTouchEndHandler';

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
  const {
    dragY,
    setDragY,
    isDragging,
    setIsDragging,
    startY,
    setStartY,
    lastY,
    setLastY,
    lastTime,
    setLastTime,
    velocity,
    setVelocity,
    canDrag,
    setCanDrag,
    isAtTop,
    setIsAtTop,
    upwardMovement,
    setUpwardMovement,
    dragProgress,
    setDragProgress,
    maxUpwardMovementRef,
  } = useDrawerState(isOpen, contentRef);

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
    if (drawerRef.current) startDrag(e.touches[0].clientY);
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

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      handleTouchMoveLogic({
        e,
        contentRef,
        drawerRef,
        startY,
        lastY,
        lastTime,
        isDragging,
        canDrag,
        threshold,
        maxUpwardMovementRef,
        onClose,
        setLastY,
        setLastTime,
        setIsAtTop,
        setUpwardMovement,
        setDragProgress,
        setDragY,
        setVelocity,
        setIsDragging,
        setCanDrag,
      });
    },
    [
      startY,
      lastY,
      lastTime,
      isDragging,
      canDrag,
      threshold,
      maxUpwardMovementRef,
      onClose,
      contentRef,
      drawerRef,
      setLastY,
      setLastTime,
      setIsAtTop,
      setUpwardMovement,
      setDragProgress,
      setDragY,
      setVelocity,
      setIsDragging,
      setCanDrag,
    ],
  );
  const handleTouchEnd = useCallback(() => {
    handleTouchEndLogic({
      contentRef,
      drawerRef,
      isDragging,
      canDrag,
      dragY,
      velocity,
      threshold,
      velocityThreshold,
      maxUpwardMovementRef,
      onClose,
      setIsDragging,
      setCanDrag,
      setVelocity,
      setDragY,
      setUpwardMovement,
      setDragProgress,
    });
  }, [
    isDragging,
    canDrag,
    dragY,
    velocity,
    threshold,
    velocityThreshold,
    maxUpwardMovementRef,
    onClose,
    contentRef,
    drawerRef,
    setIsDragging,
    setCanDrag,
    setVelocity,
    setDragY,
    setUpwardMovement,
    setDragProgress,
  ]);

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
    handleDrawerTouchStart: (e: React.TouchEvent) => e.stopPropagation(),
    isAtTop,
    upwardMovement,
    dragProgress,
  };
}
