import { handleUpwardGestureAtTop } from '../../../useDrawerSwipe.utils';

interface HandleUpwardGestureParams {
  e: React.TouchEvent;
  deltaY: number;
  absDeltaY: number;
  maxUpwardMovementRef: React.MutableRefObject<number | null>;
  onClose: () => void;
  setUpwardMovement: (movement: number) => void;
  setDragProgress: (progress: number) => void;
  setDragY: (y: number) => void;
  setVelocity: (velocity: number) => void;
  setIsDragging: (dragging: boolean) => void;
  setCanDrag: (canDrag: boolean) => void;
}

/**
 * Handle upward gesture at top of drawer
 */
export function handleUpwardGesture({
  e,
  deltaY,
  absDeltaY,
  maxUpwardMovementRef,
  onClose,
  setUpwardMovement,
  setDragProgress,
  setDragY,
  setVelocity,
  setIsDragging,
  setCanDrag,
}: HandleUpwardGestureParams): boolean {
  const result = handleUpwardGestureAtTop({ deltaY, absDeltaY, maxUpwardMovementRef, onClose });
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
    return true;
  }
  return false;
}

