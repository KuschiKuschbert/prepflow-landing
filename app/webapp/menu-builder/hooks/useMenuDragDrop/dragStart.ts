/**
 * Utilities for handling drag start events.
 */

import { logger } from '@/lib/logger';
import { DragStartEvent } from '@dnd-kit/core';

/**
 * Extract pointer coordinates from activator event.
 *
 * @param {Event} activatorEvent - Activator event
 * @returns {Object | null} Coordinates object or null
 * @returns {number} returns.x - X coordinate
 * @returns {number} returns.y - Y coordinate
 */
export function extractPointerCoordinates(activatorEvent: Event | null): { x: number; y: number } | null {
  if (!activatorEvent) {
    return null;
  }

  let clientX: number;
  let clientY: number;

  if (activatorEvent instanceof PointerEvent || activatorEvent instanceof MouseEvent) {
    clientX = activatorEvent.clientX;
    clientY = activatorEvent.clientY;
  } else if (activatorEvent instanceof TouchEvent && activatorEvent.touches.length > 0) {
    clientX = activatorEvent.touches[0].clientX;
    clientY = activatorEvent.touches[0].clientY;
  } else {
    return null;
  }

  return { x: clientX, y: clientY };
}

/**
 * Find dragged element from activator event.
 *
 * @param {Event} activatorEvent - Activator event
 * @param {string} activeId - Active drag ID
 * @returns {HTMLElement | null} Dragged element or null
 */
export function findDraggedElement(activatorEvent: Event | null, activeId: string): HTMLElement | null {
  // Try to find the dragged element - first try using the activatorEvent target
  let draggedElement: HTMLElement | null = null;

  // Traverse up from the target to find the sortable element
  if (activatorEvent?.target instanceof HTMLElement) {
    let current: HTMLElement | null = activatorEvent.target;
    while (current && !draggedElement) {
      if (current.hasAttribute('data-sortable-id')) {
        draggedElement = current;
        break;
      }
      current = current.parentElement;
    }
  }

  // Fallback: use querySelector
  if (!draggedElement) {
    draggedElement = document.querySelector(`[data-sortable-id="${activeId}"]`) as HTMLElement;
  }

  return draggedElement;
}

/**
 * Calculate initial offset from cursor position and element rect.
 *
 * @param {number} clientX - Cursor X coordinate
 * @param {number} clientY - Cursor Y coordinate
 * @param {HTMLElement} draggedElement - Dragged element
 * @returns {Object | null} Offset object or null
 * @returns {number} returns.x - X offset
 * @returns {number} returns.y - Y offset
 */
export function calculateInitialOffset(
  clientX: number,
  clientY: number,
  draggedElement: HTMLElement,
): { x: number; y: number } | null {
  // Get the rect synchronously - this should be before any transforms are applied
  const rect = draggedElement.getBoundingClientRect();
  // Calculate offset relative to the element's top-left corner
  // Note: getBoundingClientRect() returns position relative to viewport
  const offsetX = clientX - rect.left;
  const offsetY = clientY - rect.top;

  // Debug logging
  logger.dev('[Drag Debug] Initial offset calculation', {
    clientX,
    clientY,
    rectLeft: rect.left,
    rectTop: rect.top,
    offsetX,
    offsetY,
    elementWidth: rect.width,
    elementHeight: rect.height,
  });

  return { x: offsetX, y: offsetY };
}

/**
 * Handle drag start event.
 *
 * @param {DragStartEvent} event - Drag start event
 * @param {Function} setActiveId - Set active ID function
 * @param {Function} setInitialOffset - Set initial offset function
 * @param {Function} setInitialCursorPosition - Set initial cursor position function
 */
export function handleDragStart(
  event: DragStartEvent,
  setActiveId: (id: string | null) => void,
  setInitialOffset: (offset: { x: number; y: number } | null) => void,
  setInitialCursorPosition: (position: { x: number; y: number } | null) => void,
): void {
  setActiveId(event.active.id as string);

  // Track initial cursor offset relative to the dragged element
  const activatorEvent = event.activatorEvent;

  if (!activatorEvent) {
    setInitialOffset(null);
    return;
  }

  // Get pointer coordinates from the activator event
  const coordinates = extractPointerCoordinates(activatorEvent);
  if (!coordinates) {
    setInitialOffset(null);
    return;
  }

  // Find dragged element
  const draggedElement = findDraggedElement(activatorEvent, event.active.id as string);

  if (draggedElement) {
    const offset = calculateInitialOffset(coordinates.x, coordinates.y, draggedElement);
    setInitialOffset(offset);
    setInitialCursorPosition({ x: coordinates.x, y: coordinates.y });
  } else {
    // Fallback: use center offset
    setInitialOffset(null);
  }
}
