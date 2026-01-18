import { handleDownwardGestureAtTop } from '../../../useDrawerSwipe.utils';

interface HandleDownwardGestureParams {
  e: React.TouchEvent;
  deltaY: number;
  drawerHeight: number;
  threshold: number;
  lastTime: number;
  currentY: number;
  lastY: number;
  currentTime: number;
  setUpwardMovement: (movement: number) => void;
  setDragY: (y: number) => void;
  setDragProgress: (progress: number) => void;
  setVelocity: (velocity: number) => void;
}

/**
 * Handle downward gesture at top of drawer
 */
export function handleDownwardGesture({
  e,
  deltaY,
  drawerHeight,
  threshold,
  lastTime,
  currentY,
  lastY,
  currentTime,
  setUpwardMovement,
  setDragY,
  setDragProgress,
  setVelocity,
}: HandleDownwardGestureParams): void {
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
}
