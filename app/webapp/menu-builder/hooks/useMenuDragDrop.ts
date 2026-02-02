import { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { useCallback, useState } from 'react';
import type { MenuItem } from '@/lib/types/menu-builder';
import { handleDragEnd as handleDragEndHelper } from './useMenuDragDrop/dragEnd';
import { handleDragStart as handleDragStartHelper } from './useMenuDragDrop/dragStart';

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
  dishes?: unknown[]; // Not used, kept for backward compatibility
  recipes?: unknown[]; // Not used, kept for backward compatibility
  notifications?: NotificationFunctions;
}

export function useMenuDragDrop({
  menuId,
  menuItems,
  setMenuItems,
  onStatisticsUpdate,
  onMenuDataReload,
  notifications,
}: UseMenuDragDropProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [initialOffset, setInitialOffset] = useState<{ x: number; y: number } | null>(null);
  const [initialCursorPosition, setInitialCursorPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    handleDragStartHelper(event, setActiveId, setInitialOffset, setInitialCursorPosition);
  }, []);

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      setActiveId(null);
      setInitialOffset(null);
      setInitialCursorPosition(null);

      await handleDragEndHelper({
        event,
        menuId,
        menuItems,
        setMenuItems,
        onStatisticsUpdate,
        onMenuDataReload,
        notifications,
      });
    },
    [menuId, menuItems, setMenuItems, onStatisticsUpdate, onMenuDataReload, notifications],
  );

  return {
    activeId,
    initialOffset,
    initialCursorPosition,
    handleDragStart,
    handleDragEnd,
  };
}
