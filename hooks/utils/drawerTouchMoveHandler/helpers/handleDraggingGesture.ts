import { calculateDragProgress } from '../../../useDrawerSwipe.utils';

interface HandleDraggingGestureParams {
  e: React.TouchEvent;
  deltaY: number;
  drawerHeight: number;
  threshold: number;
  lastTime: number;
  currentY: number;
  lastY: number;
  currentTime: number;
  isDragging: boolean;
  canDrag: boolean;
  setDragY: (y: number) => void;
  setDragProgress: (progress: number) => void;
  setVelocity: (velocity: number) => void;
  setCanDrag: (canDrag: boolean) => void;
  setIsDragging: (dragging: boolean) => void;
}

/**
 * Handle dragging gesture when not at top
 */
export function handleDraggingGesture({
  e,
  deltaY,
  drawerHeight,
  threshold,
  lastTime,
  currentY,
  lastY,
  currentTime,
  isDragging,
  canDrag,
  setDragY,
  setDragProgress,
  setVelocity,
  setCanDrag,
  setIsDragging,
}: HandleDraggingGestureParams): void {
  if (isDragging && canDrag && deltaY > 5) {
    setDragY(deltaY);
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
