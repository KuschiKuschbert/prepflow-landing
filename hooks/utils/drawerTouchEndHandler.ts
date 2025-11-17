interface TouchEndParams {
  contentRef: React.RefObject<HTMLDivElement | null>;
  drawerRef: React.RefObject<HTMLDivElement | null>;
  isDragging: boolean;
  canDrag: boolean;
  dragY: number;
  velocity: number;
  threshold: number;
  velocityThreshold: number;
  maxUpwardMovementRef: React.MutableRefObject<number | null>;
  onClose: () => void;
  setIsDragging: (dragging: boolean) => void;
  setCanDrag: (canDrag: boolean) => void;
  setVelocity: (velocity: number) => void;
  setDragY: (y: number) => void;
  setUpwardMovement: (movement: number) => void;
  setDragProgress: (progress: number) => void;
}

export function handleTouchEndLogic({
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
}: TouchEndParams): void {
  if (!contentRef.current) {
    setIsDragging(false);
    setCanDrag(false);
    setVelocity(0);
    maxUpwardMovementRef.current = 0;
    return;
  }
  const isAtTop = contentRef.current.scrollTop <= 5;
  if (isAtTop && isDragging && (maxUpwardMovementRef.current ?? 0) > 15) {
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
  if (!isDragging || !drawerRef.current) {
    setIsDragging(false);
    setCanDrag(false);
    setVelocity(0);
    setDragProgress(0);
    return;
  }
  if (dragY > 0 && (canDrag || isAtTop) && drawerRef.current) {
    const drawerHeight = drawerRef.current.offsetHeight;
    if (dragY > drawerHeight * threshold || velocity > velocityThreshold) onClose();
    else setDragY(0);
  } else setDragY(0);
  setIsDragging(false);
  setCanDrag(false);
  setVelocity(0);
  setDragProgress(0);
}
