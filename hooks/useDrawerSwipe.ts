import { useCallback, useRef } from 'react';
import { useDrawerState } from './utils/drawerStateManagement';
import { handleTouchMoveLogic } from './utils/drawerTouchMoveHandler';
import { handleTouchEndLogic } from './utils/drawerTouchEndHandler';
import {
  startDrag,
  handleHandleTouchStart as handleHandleTouchStartHelper,
  handleContentTouchStart as handleContentTouchStartHelper,
} from './useDrawerSwipe/touchStartHandlers';

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

  const handleHandleTouchStart = (e: React.TouchEvent) => {
    handleHandleTouchStartHelper(e, drawerRef, (touchY: number) => {
      startDrag(
        touchY,
        setStartY,
        setLastY,
        setLastTime,
        setIsDragging,
        setCanDrag,
        setVelocity,
        setDragY,
      );
    });
  };

  const handleContentTouchStart = (e: React.TouchEvent) => {
    handleContentTouchStartHelper(
      e,
      contentRef,
      drawerRef,
      contentTopDragArea,
      maxUpwardMovementRef,
      setStartY,
      setLastY,
      setLastTime,
      setIsAtTop,
      setUpwardMovement,
      setDragProgress,
      setIsDragging,
      setCanDrag,
      setDragY,
      setVelocity,
    );
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
