/**
 * Touch start handlers for drawer swipe.
 */

/**
 * Start drag operation.
 *
 * @param {number} touchY - Touch Y coordinate
 * @param {Function} setStartY - Set start Y function
 * @param {Function} setLastY - Set last Y function
 * @param {Function} setLastTime - Set last time function
 * @param {Function} setIsDragging - Set is dragging function
 * @param {Function} setCanDrag - Set can drag function
 * @param {Function} setVelocity - Set velocity function
 * @param {Function} setDragY - Set drag Y function
 */
export function startDrag(
  touchY: number,
  setStartY: (y: number) => void,
  setLastY: (y: number) => void,
  setLastTime: (time: number) => void,
  setIsDragging: (dragging: boolean) => void,
  setCanDrag: (canDrag: boolean) => void,
  setVelocity: (velocity: number) => void,
  setDragY: (y: number) => void,
): void {
  const now = Date.now();
  setStartY(touchY);
  setLastY(touchY);
  setLastTime(now);
  setIsDragging(true);
  setCanDrag(true);
  setVelocity(0);
  setDragY(0);
}

/**
 * Handle handle touch start.
 *
 * @param {React.TouchEvent} e - Touch event
 * @param {React.RefObject<HTMLDivElement | null>} drawerRef - Drawer ref
 * @param {Function} startDragFn - Start drag function
 */
export function handleHandleTouchStart(
  e: React.TouchEvent,
  drawerRef: React.RefObject<HTMLDivElement | null>,
  startDragFn: (touchY: number) => void,
): void {
  e.stopPropagation();
  if (drawerRef.current) {
    startDragFn(e.touches[0].clientY);
  }
}

/**
 * Handle content touch start.
 *
 * @param {React.TouchEvent} e - Touch event
 * @param {React.RefObject<HTMLDivElement | null>} contentRef - Content ref
 * @param {React.RefObject<HTMLDivElement | null>} drawerRef - Drawer ref
 * @param {number} contentTopDragArea - Content top drag area
 * @param {React.MutableRefObject<number>} maxUpwardMovementRef - Max upward movement ref
 * @param {Function} setStartY - Set start Y function
 * @param {Function} setLastY - Set last Y function
 * @param {Function} setLastTime - Set last time function
 * @param {Function} setIsAtTop - Set is at top function
 * @param {Function} setUpwardMovement - Set upward movement function
 * @param {Function} setDragProgress - Set drag progress function
 * @param {Function} setIsDragging - Set is dragging function
 * @param {Function} setCanDrag - Set can drag function
 * @param {Function} setDragY - Set drag Y function
 * @param {Function} setVelocity - Set velocity function
 */
export function handleContentTouchStart(
  e: React.TouchEvent,
  contentRef: React.RefObject<HTMLDivElement | null>,
  drawerRef: React.RefObject<HTMLDivElement | null>,
  contentTopDragArea: number,
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
  const touchY = e.touches[0].clientY;
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
