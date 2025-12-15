/**
 * Calculate popover position for inline time entry.
 */
export function calculatePopoverPosition(cellPosition?: { top: number; left: number; width: number; height: number }): { top: number; left: number } | null {
  if (!cellPosition) {
    return { top: window.innerHeight / 2 - 100, left: window.innerWidth / 2 - 150 };
  }
  const popoverWidth = 320;
  const popoverHeight = 180;
  const spacing = 8;
  const viewportPadding = 16;
  const spaceAbove = cellPosition.top;
  const spaceBelow = window.innerHeight - cellPosition.top - cellPosition.height;
  const shouldPlaceAbove = spaceBelow < popoverHeight + spacing && spaceAbove > spaceBelow;
  let top = shouldPlaceAbove ? cellPosition.top - popoverHeight - spacing : cellPosition.top + cellPosition.height + spacing;
  top = Math.max(viewportPadding, Math.min(window.innerHeight - popoverHeight - viewportPadding, top));
  let left = cellPosition.left + cellPosition.width / 2 - popoverWidth / 2;
  left = Math.max(viewportPadding, Math.min(window.innerWidth - popoverWidth - viewportPadding, left));
  return { top, left };
}
