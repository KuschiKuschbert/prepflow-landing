/**
 * Resolve tooltip position from mouse position or anchor element.
 */
import { getPositionFromAnchor } from './getPositionFromAnchor';

export function resolvePosition(
  mousePosition?: { x: number; y: number },
  anchorElement?: HTMLElement | null,
): { x: number; y: number } | null {
  if (mousePosition && typeof mousePosition.x === 'number' && typeof mousePosition.y === 'number') {
    return mousePosition;
  }
  return getPositionFromAnchor(anchorElement || null);
}
