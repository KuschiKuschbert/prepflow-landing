/**
 * Drag modifier to position overlay relative to cursor based on initial grab point
 */

import type { Modifier } from '@dnd-kit/core';
import { logger } from '@/lib/logger';

interface CenterOnCursorModifierProps {
  initialOffset?: { x: number; y: number } | null;
  initialCursorPosition?: { x: number; y: number } | null;
}

export function createCenterOnCursorModifier({
  initialOffset,
  initialCursorPosition,
}: CenterOnCursorModifierProps): Modifier {
  return ({ transform, draggingNodeRect }) => {
    if (!draggingNodeRect) return transform;

    // Use tracked initial offset if available
    if (initialOffset && initialCursorPosition) {
      // Verify the calculation: initialCursorPosition should equal draggingNodeRect + initialOffset
      // If not, there might be a coordinate system mismatch
      const expectedCursorX = draggingNodeRect.left + initialOffset.x;
      const expectedCursorY = draggingNodeRect.top + initialOffset.y;
      const cursorMismatch =
        Math.abs(expectedCursorX - initialCursorPosition.x) > 1 ||
        Math.abs(expectedCursorY - initialCursorPosition.y) > 1;

      if (cursorMismatch) {
        logger.dev('[Drag Debug] Coordinate mismatch detected', {
          draggingNodeRectLeft: draggingNodeRect.left,
          draggingNodeRectTop: draggingNodeRect.top,
          initialOffsetX: initialOffset.x,
          initialOffsetY: initialOffset.y,
          expectedCursorX,
          expectedCursorY,
          actualInitialCursorX: initialCursorPosition.x,
          actualInitialCursorY: initialCursorPosition.y,
        });
      }

      // The transform represents movement delta
      // dnd-kit positions overlay at: draggingNodeRect.position + transform
      // We want overlay positioned so grab point follows cursor
      // Current cursor ≈ initialCursorPosition + transform (movement delta)
      // Target overlay position = currentCursor - initialOffset
      // = (initialCursorPosition + transform) - initialOffset
      // = initialCursorPosition - initialOffset + transform
      // dnd-kit does: draggingNodeRect + transform
      // So we need: draggingNodeRect + transform = initialCursorPosition - initialOffset + transform
      // Therefore: transform = initialCursorPosition - initialOffset - draggingNodeRect + transform
      // Which simplifies to: transform = transform + (initialCursorPosition - initialOffset - draggingNodeRect)
      // But initialCursorPosition should equal draggingNodeRect + initialOffset
      // So: transform = transform + (draggingNodeRect + initialOffset - initialOffset - draggingNodeRect)
      //    = transform + 0 = transform
      //
      // dnd-kit's default behavior might center the overlay on the cursor
      // We need to adjust for the difference between where user grabbed (initialOffset)
      // and where dnd-kit assumes (center of element)
      // Adjustment needed: initialOffset - centerOffset
      const centerOffsetX = draggingNodeRect.width / 2;
      const centerOffsetY = draggingNodeRect.height / 2;
      const offsetFromCenterX = initialOffset.x - centerOffsetX;
      const offsetFromCenterY = initialOffset.y - centerOffsetY;

      // Adjust transform to account for the difference
      return {
        ...transform,
        x: transform.x - offsetFromCenterX,
        y: transform.y - offsetFromCenterY,
      };
    }

    // Fallback: center the overlay on the cursor by offsetting by half the dimensions
    return {
      ...transform,
      x: transform.x - draggingNodeRect.width / 2,
      y: transform.y - draggingNodeRect.height / 2,
    };
  };
}
