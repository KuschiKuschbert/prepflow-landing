import {
  calculateDragProgress,
  handleDownwardGestureAtTop,
  handleUpwardGestureAtTop,
} from '../useDrawerSwipe.utils';

interface TouchMoveParams {
  e: React.TouchEvent;
  contentRef: React.RefObject<HTMLDivElement | null>;
  drawerRef: React.RefObject<HTMLDivElement | null>;
  startY: number;
  lastY: number;
  lastTime: number;
  isDragging: boolean;
  canDrag: boolean;
  threshold: number;
  maxUpwardMovementRef: React.MutableRefObject<number | null>;
  onClose: () => void;
  setLastY: (y: number) => void;
  setLastTime: (time: number) => void;
  setIsAtTop: (atTop: boolean) => void;
  setUpwardMovement: (movement: number) => void;
  setDragProgress: (progress: number) => void;
  setDragY: (y: number) => void;
  setVelocity: (velocity: number) => void;
  setIsDragging: (dragging: boolean) => void;
  setCanDrag: (canDrag: boolean) => void;
}

export function handleTouchMoveLogic({
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
}: TouchMoveParams): void {
  if (!contentRef.current || !drawerRef.current) return;
  const currentY = e.touches[0].clientY;
  const currentTime = Date.now();
  const atTop = contentRef.current.scrollTop <= 5;
  const deltaY = currentY - startY;
  const absDeltaY = Math.abs(deltaY);
  setLastY(currentY);
  setLastTime(currentTime);
  setIsAtTop(atTop);
  if (atTop && isDragging) {
    if (deltaY < -5) {
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
        return;
      }
    } else if (deltaY > 10 && drawerRef.current) {
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
      setUpwardMovement(0);
      setDragProgress(0);
      setDragY(0);
      setVelocity(0);
    }
  } else {
    setUpwardMovement(0);
    if (isDragging && canDrag && deltaY > 5 && drawerRef.current) {
      setDragY(deltaY);
      setDragProgress(
        calculateDragProgress({ deltaY, drawerHeight: drawerRef.current.offsetHeight, threshold }),
      );
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
    } else if (!isDragging || !canDrag) setDragProgress(0);
  }
}
