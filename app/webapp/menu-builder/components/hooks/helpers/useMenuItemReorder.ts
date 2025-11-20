/**
 * Hook for reordering menu items (move up/down, drag and drop).
 */
import { useCallback } from 'react';
import { logger } from '@/lib/logger';

interface UseMenuItemReorderProps {
  menuId: string;
  menuItems: any[];
  setMenuItems: React.Dispatch<React.SetStateAction<any[]>>;
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
  const handleRefreshError = (err: any) => logger.error('Failed to refresh statistics:', err);
  const performReorder = useCallback(
    async (activeId: string, overId: string, category: string) => {
      const originalMenuItems = [...menuItems];
      const categoryItems = menuItems
        .filter(item => item.category === category)
        .sort((a, b) => a.position - b.position);

      const oldIndex = categoryItems.findIndex(item => item.id === activeId);
      const newIndex = categoryItems.findIndex(item => item.id === overId);

      if (oldIndex === -1 || newIndex === -1) return;
      const reordered = [...categoryItems];
      const [movedItem] = reordered.splice(oldIndex, 1);
      reordered.splice(newIndex, 0, movedItem);

      const updatedItems = reordered.map((item, index) => ({
        ...item,
        position: index,
      }));

      const otherItems = menuItems.filter(item => item.category !== category);
      setMenuItems([...otherItems, ...updatedItems]);
      refreshStatistics().catch(handleRefreshError);
      try {
        const response = await fetch(`/api/menus/${menuId}/reorder`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: updatedItems.map(item => ({ id: item.id, category: item.category, position: item.position })) }),
        });

        const result = await response.json();

        if (response.ok) {
          refreshStatistics().catch(handleRefreshError);
        } else {
          setMenuItems(originalMenuItems);
          logger.error('Failed to reorder items:', result.error || result.message);
          showError(`Failed to reorder items: ${result.error || result.message || 'Unknown error'}`);
          refreshStatistics().catch(handleRefreshError);
        }
      } catch (err) {
        setMenuItems(originalMenuItems);
        logger.error('Failed to reorder items:', err);
        showError('Failed to reorder items. Please check your connection and try again.');
        refreshStatistics().catch(handleRefreshError);
      }
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
      const targetItem = categoryItems[currentIndex - 1];
      await performReorder(itemId, targetItem.id, item.category);
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
      const targetItem = categoryItems[currentIndex + 1];
      await performReorder(itemId, targetItem.id, item.category);
    },
    [menuItems, performReorder],
  );

  return {
    handleMoveUp,
    handleMoveDown,
    performReorder,
  };
}
