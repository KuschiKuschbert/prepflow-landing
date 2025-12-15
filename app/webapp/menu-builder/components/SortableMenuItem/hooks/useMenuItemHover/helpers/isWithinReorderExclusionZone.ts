/**
 * Check if mouse is within exclusion zone (20px) of reorder button.
 */
export function isWithinReorderExclusionZone(
  mouseX: number,
  mouseY: number,
  reorderButtonRef?: React.RefObject<HTMLButtonElement | null>,
): boolean {
  if (!reorderButtonRef?.current) return false;

  const buttonRect = reorderButtonRef.current.getBoundingClientRect();
  const buttonCenterX = buttonRect.left + buttonRect.width / 2;
  const buttonCenterY = buttonRect.top + buttonRect.height / 2;

  const distanceX = Math.abs(mouseX - buttonCenterX);
  const distanceY = Math.abs(mouseY - buttonCenterY);
  const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

  return distance < 20;
}
