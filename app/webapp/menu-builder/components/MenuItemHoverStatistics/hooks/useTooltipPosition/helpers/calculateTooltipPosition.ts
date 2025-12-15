/**
 * Calculate tooltip position based on mouse/anchor position and viewport constraints.
 */
interface CalculatePositionParams {
  position: { x: number; y: number };
  tooltipWidth: number;
  tooltipHeight: number;
  viewportWidth: number;
  viewportHeight: number;
  buttonsAreaRight: number;
  padding: number;
  offset: number;
}

export function calculateTooltipPosition({
  position,
  tooltipWidth,
  tooltipHeight,
  viewportWidth,
  viewportHeight,
  buttonsAreaRight,
  padding,
  offset,
}: CalculatePositionParams): { left: number; top: number } {
  let left = position.x - tooltipWidth - offset;

  if (left + tooltipWidth > buttonsAreaRight - padding) {
    left = buttonsAreaRight - tooltipWidth - offset - padding;
  }

  if (left < padding) {
    left = position.x + offset;
    if (left + tooltipWidth > buttonsAreaRight - padding) {
      left = buttonsAreaRight - tooltipWidth - offset - padding;
    }
  }

  if (left + tooltipWidth > viewportWidth - padding) {
    left = viewportWidth - tooltipWidth - padding;
  }
  if (left < padding) left = padding;

  let top = position.y - tooltipHeight / 2;
  if (top < padding) top = position.y + offset;
  if (top + tooltipHeight > viewportHeight - padding) {
    top = position.y - tooltipHeight - offset;
    if (top < padding) top = padding;
  }

  return { left, top };
}
