/**
 * Utilities for handling drag start events.
 */
import { DragStartEvent } from '@dnd-kit/core';

/**
 * Extract pointer coordinates from activator event.
 */
export function extractPointerCoordinates(
  activatorEvent: Event | null,
): { x: number; y: number } | null {
  if (!activatorEvent) return null;
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
 */
export function findDraggedElement(
  activatorEvent: Event | null,
  activeId: string,
): HTMLElement | null {
  let draggedElement: HTMLElement | null = null;
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
  if (!draggedElement) {
    draggedElement = document.querySelector(`[data-sortable-id="${activeId}"]`) as HTMLElement;
  }

  return draggedElement;
}
/**
 * Calculate initial offset from cursor position and element rect.
 */
export function calculateInitialOffset(
  clientX: number,
  clientY: number,
  draggedElement: HTMLElement,
): { x: number; y: number } | null {
  const rect = draggedElement.getBoundingClientRect();
  const offsetX = clientX - rect.left;
  const offsetY = clientY - rect.top;
  return { x: offsetX, y: offsetY };
}
/**
 * Handle drag start event.
 */
export function handleDragStart(
  event: DragStartEvent,
  setActiveId: (id: string | null) => void,
  setInitialOffset: (offset: { x: number; y: number } | null) => void,
  setInitialCursorPosition: (position: { x: number; y: number } | null) => void,
): void {
  setActiveId(event.active.id as string);
  const activatorEvent = event.activatorEvent;
  if (!activatorEvent) {
    setInitialOffset(null);
    return;
  }
  const coordinates = extractPointerCoordinates(activatorEvent);
  if (!coordinates) {
    setInitialOffset(null);
    return;
  }
  const draggedElement = findDraggedElement(activatorEvent, event.active.id as string);
  if (draggedElement) {
    const offset = calculateInitialOffset(coordinates.x, coordinates.y, draggedElement);
    setInitialOffset(offset);
    setInitialCursorPosition(coordinates);
  } else {
    setInitialOffset(null);
  }
}
