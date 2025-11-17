import { logger } from '@/lib/logger';
import { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { useState } from 'react';
import { Dish, MenuItem, Recipe } from '../types';
import { reorderMenuItems } from '../utils/menuDragDropHelpers';

interface NotificationFunctions {
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
}

interface UseMenuDragDropProps {
  menuId: string;
  menuItems: MenuItem[];
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
  onStatisticsUpdate: () => void;
  onMenuDataReload: () => Promise<void>;
  dishes: Dish[];
  recipes: Recipe[];
  notifications?: NotificationFunctions;
}

export function useMenuDragDrop({
  menuId,
  menuItems,
  setMenuItems,
  onStatisticsUpdate,
  onMenuDataReload,
  dishes,
  recipes,
  notifications,
}: UseMenuDragDropProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [initialOffset, setInitialOffset] = useState<{ x: number; y: number } | null>(null);
  const [initialCursorPosition, setInitialCursorPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);

    // Track initial cursor offset relative to the dragged element
    const activatorEvent = event.activatorEvent;

    if (!activatorEvent) {
      setInitialOffset(null);
      return;
    }

    // Get pointer coordinates from the activator event
    let clientX: number;
    let clientY: number;

    if (activatorEvent instanceof PointerEvent || activatorEvent instanceof MouseEvent) {
      clientX = activatorEvent.clientX;
      clientY = activatorEvent.clientY;
    } else if (activatorEvent instanceof TouchEvent && activatorEvent.touches.length > 0) {
      clientX = activatorEvent.touches[0].clientX;
      clientY = activatorEvent.touches[0].clientY;
    } else {
      setInitialOffset(null);
      return;
    }

    // Try to find the dragged element - first try using the activatorEvent target
    let draggedElement: HTMLElement | null = null;

    // Traverse up from the target to find the sortable element
    if (activatorEvent.target instanceof HTMLElement) {
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
      draggedElement = document.querySelector(
        `[data-sortable-id="${event.active.id}"]`,
      ) as HTMLElement;
    }

    if (draggedElement) {
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

      setInitialOffset({ x: offsetX, y: offsetY });
      setInitialCursorPosition({ x: clientX, y: clientY });
    } else {
      // Fallback: use center offset
      setInitialOffset(null);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setInitialOffset(null);
    setInitialCursorPosition(null);

    if (!over) return;

    // Only handle menu-item drag-and-drop for rearranging
    // Tap-to-add handles adding items from palette

    // Handle reordering within category or moving between categories
    if (active.data.current?.type === 'menu-item') {
      const activeItem = menuItems.find(item => item.id === active.id);
      if (!activeItem) return;

      // If dropped on another menu item, reorder within that item's category
      if (over.data.current?.type === 'menu-item') {
        const overItem = menuItems.find(item => item.id === over.id);
        if (!overItem) return;

        // If same category, reorder within category
        if (activeItem.category === overItem.category) {
          await reorderMenuItems(
            menuId,
            menuItems,
            activeItem,
            active.id as string,
            over.id as string,
            setMenuItems,
            onStatisticsUpdate,
            onMenuDataReload,
          );
        } else {
          // Different category - move item to new category at the position of the target item
          const targetCategory = overItem.category;
          const targetPosition = overItem.position;

          try {
            const response = await fetch(`/api/menus/${menuId}/items/${activeItem.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                category: targetCategory,
                position: targetPosition,
              }),
            });

            if (response.ok) {
              await onMenuDataReload();
              await onStatisticsUpdate();
            } else {
              const result = await response.json();
              notifications?.showError(
                `Failed to move item: ${result.error || result.message || 'Unknown error'}`,
              );
            }
          } catch (err) {
            notifications?.showError(
              'Failed to move item. Please check your connection and try again.',
            );
          }
        }
      }
      // If dropped on a category, move item to that category
      else if (over.data.current?.type === 'category') {
        const targetCategory = over.data.current.category as string;

        // Update item's category
        try {
          const response = await fetch(`/api/menus/${menuId}/items/${activeItem.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              category: targetCategory,
              position: activeItem.position,
            }),
          });

          if (response.ok) {
            await onMenuDataReload();
            await onStatisticsUpdate();
          } else {
            const result = await response.json();
            notifications?.showError(
              `Failed to move item: ${result.error || result.message || 'Unknown error'}`,
            );
          }
        } catch (err) {
          notifications?.showError(
            'Failed to move item. Please check your connection and try again.',
          );
        }
      }
    }
  };

  return {
    activeId,
    initialOffset,
    initialCursorPosition,
    handleDragStart,
    handleDragEnd,
  };
}
