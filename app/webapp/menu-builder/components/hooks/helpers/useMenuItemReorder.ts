/**
 * Hook for reordering menu items (move up/down, drag and drop).
 */
import { useCallback } from 'react';
import { MenuItem } from '../../../types';
import { performReorder as performReorderOperation } from './useMenuItemReorder/helpers/performReorder';

interface UseMenuItemReorderProps {
  menuId: string;
  menuItems: MenuItem[];
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
  refreshStatistics: () => Promise<void>;
  showError: (message: string) => void;
}

/**
 * Hook for reordering menu items.
 */
export function useMenuItemReorder({
  menuId,
  menuItems,
  setMenuItems,
  refreshStatistics,
  showError,
}: UseMenuItemReorderProps) {
  const performReorder = useCallback(
    async (activeId: string, overId: string, category: string) => {
      await performReorderOperation({
        menuId,
        menuItems,
        setMenuItems,
        refreshStatistics,
        showError,
        activeId,
        overId,
        category,
      });
    },
    [menuId, menuItems, setMenuItems, refreshStatistics, showError],
  );

  const handleMoveUp = useCallback(
    async (itemId: string) => {
      const item = menuItems.find(i => i.id === itemId);
      if (!item) return;
      const categoryItems = menuItems
        .filter(i => i.category === item.category)
        .sort((a, b) => a.position - b.position);
      const currentIndex = categoryItems.findIndex(i => i.id === itemId);
      if (currentIndex <= 0) return;
      await performReorder(itemId, categoryItems[currentIndex - 1].id, item.category);
    },
    [menuItems, performReorder],
  );

  const handleMoveDown = useCallback(
    async (itemId: string) => {
      const item = menuItems.find(i => i.id === itemId);
      if (!item) return;
      const categoryItems = menuItems
        .filter(i => i.category === item.category)
        .sort((a, b) => a.position - b.position);
      const currentIndex = categoryItems.findIndex(i => i.id === itemId);
      if (currentIndex === -1 || currentIndex >= categoryItems.length - 1) return;
      await performReorder(itemId, categoryItems[currentIndex + 1].id, item.category);
    },
    [menuItems, performReorder],
  );

  return {
    handleMoveUp,
    handleMoveDown,
    performReorder,
  };
}
