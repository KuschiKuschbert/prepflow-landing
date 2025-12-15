/**
 * Calculate popover position for methodology tooltip.
 */
export function calculatePopoverPosition(buttonRect: DOMRect): { top: number; left: number } {
  return {
    top: buttonRect.top - 8,
    left: buttonRect.left + buttonRect.width / 2,
  };
}
