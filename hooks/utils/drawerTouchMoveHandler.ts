import { handleUpwardGesture } from './drawerTouchMoveHandler/helpers/handleUpwardGesture';
import { handleDownwardGesture } from './drawerTouchMoveHandler/helpers/handleDownwardGesture';
import { handleDraggingGesture } from './drawerTouchMoveHandler/helpers/handleDraggingGesture';

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
      const shouldReturn = handleUpwardGesture({
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
      });
      if (shouldReturn) return;
    } else if (deltaY > 10 && drawerRef.current) {
      handleDownwardGesture({
        e,
        deltaY,
        drawerHeight: drawerRef.current.offsetHeight,
        threshold,
        lastTime,
        currentY,
        lastY,
        currentTime,
        setUpwardMovement,
        setDragY,
        setDragProgress,
        setVelocity,
      });
    } else {
      setUpwardMovement(0);
      setDragProgress(0);
      setDragY(0);
      setVelocity(0);
    }
  } else {
    setUpwardMovement(0);
    if (drawerRef.current) {
      handleDraggingGesture({
        e,
        deltaY,
        drawerHeight: drawerRef.current.offsetHeight,
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
      });
    }
  }
}
