/**
 * Perform reorder operation for menu items.
 */
import { logger } from '@/lib/logger';
import { MenuItem } from '@/lib/types/menu-builder';

interface PerformReorderParams {
  menuId: string;
  menuItems: MenuItem[];
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
  refreshStatistics: () => Promise<void>;
  showError: (message: string) => void;
  activeId: string;
  overId: string;
  category: string;
}

export async function performReorder({
  menuId,
  menuItems,
  setMenuItems,
  refreshStatistics,
  showError,
  activeId,
  overId,
  category,
}: PerformReorderParams): Promise<void> {
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

  // Optimistically update UI immediately
  setMenuItems([...otherItems, ...updatedItems]);

  try {
    const response = await fetch(`/api/menus/${menuId}/reorder`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: updatedItems.map(item => ({
          id: item.id,
          category: item.category,
          position: item.position,
        })),
      }),
    });
    const result = await response.json();
    if (response.ok) {
      // Refresh statistics in background (non-blocking)
      refreshStatistics().catch(err => logger.error('Failed to refresh statistics:', err));
    } else {
      // Rollback on error
      setMenuItems(originalMenuItems);
      logger.error('Failed to reorder items:', result.error || result.message);
      showError(`Failed to reorder items: ${result.error || result.message || 'Unknown error'}`);
    }
  } catch (err) {
    // Rollback on error
    setMenuItems(originalMenuItems);
    logger.error('Failed to reorder items:', err);
    showError('Failed to reorder items. Give it another go, chef.');
  }
}
