interface GestureState {
  upwardMovement: number;
  dragProgress: number;
  dragY: number;
  velocity: number;
  maxUpwardMovement: number;
}

interface CalculateProgressParams {
  deltaY: number;
  drawerHeight: number;
  threshold: number;
}

interface HandleUpwardGestureParams {
  deltaY: number;
  absDeltaY: number;
  maxUpwardMovementRef: React.MutableRefObject<number | null>;
  onClose: () => void;
}

interface HandleDownwardGestureParams {
  deltaY: number;
  drawerHeight: number;
  threshold: number;
  lastTime: number;
  currentY: number;
  lastY: number;
  currentTime: number;
}

export function calculateDragProgress({
  deltaY,
  drawerHeight,
  threshold,
}: CalculateProgressParams): number {
  return Math.min(1, deltaY / (drawerHeight * threshold));
}
export function handleUpwardGestureAtTop({
  deltaY,
  absDeltaY,
  maxUpwardMovementRef,
  onClose,
}: HandleUpwardGestureParams): {
  shouldClose: boolean;
  upwardMovement: number;
  progress: number;
} {
  const upwardMovementValue = absDeltaY;
  maxUpwardMovementRef.current = Math.max(maxUpwardMovementRef.current, upwardMovementValue);
  const progress = Math.min(1, upwardMovementValue / 15);
  const shouldClose = deltaY < -15;

  if (shouldClose) {
    onClose();
  }

  return {
    shouldClose,
    upwardMovement: upwardMovementValue,
    progress,
  };
}
export function handleDownwardGestureAtTop({
  deltaY,
  drawerHeight,
  threshold,
  lastTime,
  currentY,
  lastY,
  currentTime,
}: HandleDownwardGestureParams): {
  progress: number;
  velocity: number;
  shouldPreventDefault: boolean;
} {
  const progress = calculateDragProgress({ deltaY, drawerHeight, threshold });
  const velocity =
    lastTime > 0 && currentTime - lastTime > 0
      ? Math.abs((currentY - lastY) / (currentTime - lastTime))
      : 0;
  const shouldPreventDefault = deltaY > 20;

  return {
    progress: deltaY > 10 && deltaY <= 20 ? progress * 0.6 : progress,
    velocity,
    shouldPreventDefault,
  };
}
export function calculateVelocity(
  currentY: number,
  lastY: number,
  currentTime: number,
  lastTime: number,
): number {
  if (lastTime === 0 || currentTime - lastTime === 0) return 0;
  return Math.abs((currentY - lastY) / (currentTime - lastTime));
}
