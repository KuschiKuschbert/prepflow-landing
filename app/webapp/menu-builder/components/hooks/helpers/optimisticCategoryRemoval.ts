/**
 * Helper function for optimistic category removal updates.
 */

import { logger } from '@/lib/logger';
import type { MenuItem } from '@/lib/types/menu-builder';

interface OptimisticCategoryRemovalProps {
  category: string;
  menuItems: MenuItem[];
  categories: string[];
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
  setCategories: React.Dispatch<React.SetStateAction<string[]>>;
  refreshStatistics: () => Promise<void>;
}

/**
 * Apply optimistic updates for category removal.
 *
 * @param {OptimisticCategoryRemovalProps} props - Update props
 * @returns {MenuItem[]} Items that need to be moved
 */
export function optimisticCategoryRemoval({
  category,
  menuItems,
  categories,
  setMenuItems,
  setCategories,
  refreshStatistics,
}: OptimisticCategoryRemovalProps): MenuItem[] {
  // Optimistically update UI immediately
  const itemsToMove = menuItems.filter(item => item.category === category);
  if (itemsToMove.length > 0) {
    // Optimistically move items to Uncategorized
    setMenuItems(prevItems =>
      prevItems.map(item =>
        item.category === category ? { ...item, category: 'Uncategorized' } : item,
      ),
    );
  }
  setCategories(categories.filter(c => c !== category));

  // Update statistics optimistically in background
  refreshStatistics().catch(err => {
    logger.error('Failed to refresh statistics:', err);
  });

  return itemsToMove;
}
