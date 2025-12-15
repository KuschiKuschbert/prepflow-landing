/**
 * Touch start handlers for drawer swipe.
 */
import { handleContentTouchStartLogic } from './touchStartHandlers/helpers/contentTouchStart';

export function startDrag(touchY: number, setStartY: (y: number) => void, setLastY: (y: number) => void, setLastTime: (time: number) => void, setIsDragging: (dragging: boolean) => void, setCanDrag: (canDrag: boolean) => void, setVelocity: (velocity: number) => void, setDragY: (y: number) => void): void {
  const now = Date.now();
  setStartY(touchY);
  setLastY(touchY);
  setLastTime(now);
  setIsDragging(true);
  setCanDrag(true);
  setVelocity(0);
  setDragY(0);
}

export function handleHandleTouchStart(e: React.TouchEvent, drawerRef: React.RefObject<HTMLDivElement | null>, startDragFn: (touchY: number) => void): void {
  e.stopPropagation();
  if (drawerRef.current) startDragFn(e.touches[0].clientY);
}

export function handleContentTouchStart(e: React.TouchEvent, contentRef: React.RefObject<HTMLDivElement | null>, drawerRef: React.RefObject<HTMLDivElement | null>, contentTopDragArea: number, maxUpwardMovementRef: React.MutableRefObject<number>, setStartY: (y: number) => void, setLastY: (y: number) => void, setLastTime: (time: number) => void, setIsAtTop: (atTop: boolean) => void, setUpwardMovement: (movement: number) => void, setDragProgress: (progress: number) => void, setIsDragging: (dragging: boolean) => void, setCanDrag: (canDrag: boolean) => void, setDragY: (y: number) => void, setVelocity: (velocity: number) => void): void {
  handleContentTouchStartLogic(contentRef, drawerRef, contentTopDragArea, e.touches[0].clientY, maxUpwardMovementRef, setStartY, setLastY, setLastTime, setIsAtTop, setUpwardMovement, setDragProgress, setIsDragging, setCanDrag, setDragY, setVelocity);
}
