/**
 * Get position from anchor element.
 */
export function getPositionFromAnchor(anchorElement: HTMLElement | null): { x: number; y: number } | null {
  if (!anchorElement) return null;
  const rect = anchorElement.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };
}
