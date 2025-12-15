/**
 * Handle content touch start logic.
 */
export function handleContentTouchStartLogic(
  contentRef: React.RefObject<HTMLDivElement | null>,
  drawerRef: React.RefObject<HTMLDivElement | null>,
  contentTopDragArea: number,
  touchY: number,
  maxUpwardMovementRef: React.MutableRefObject<number>,
  setStartY: (y: number) => void,
  setLastY: (y: number) => void,
  setLastTime: (time: number) => void,
  setIsAtTop: (atTop: boolean) => void,
  setUpwardMovement: (movement: number) => void,
  setDragProgress: (progress: number) => void,
  setIsDragging: (dragging: boolean) => void,
  setCanDrag: (canDrag: boolean) => void,
  setDragY: (y: number) => void,
  setVelocity: (velocity: number) => void,
): void {
  if (!contentRef.current || !drawerRef.current) return;
  const atTop = contentRef.current.scrollTop <= 5;
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
}
