'use client';
import { useCallback, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';
import { Menu } from '@/app/webapp/menu-builder/types';

interface UseBulkAddToMenuProps {
  selectedItems: Set<string>;
  selectedItemTypes: Map<string, 'recipe' | 'dish'>;
  onSuccess?: () => void;
}

export function useBulkAddToMenu({
  selectedItems,
  selectedItemTypes,
  onSuccess,
}: UseBulkAddToMenuProps) {
  const router = useRouter();
  const { showSuccess, showError } = useNotification();
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loadingMenus, setLoadingMenus] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [showMenuDialog, setShowMenuDialog] = useState(false);

  const fetchMenus = useCallback(async () => {
    setLoadingMenus(true);
    try {
      const response = await fetch('/api/menus');
      const result = await response.json();

      if (result.success && result.menus) {
        setMenus(result.menus);
      } else {
        logger.error('Failed to fetch menus:', result);
        showError('Failed to load menus');
      }
    } catch (err) {
      logger.error('Error fetching menus:', err);
      showError('Failed to load menus. Please check your connection and try again.');
    } finally {
      setLoadingMenus(false);
    }
  }, [showError]);
  const handleBulkAddToMenu = useCallback(() => {
    if (selectedItems.size === 0) {
      showError('No items selected');
      return;
    }
    setShowMenuDialog(true);
  }, [selectedItems.size, showError]);
  const handleSelectMenu = useCallback(
    async (menuId: string) => {
      if (selectedItems.size === 0) {
        showError('No items selected');
        return;
      }
      setAddLoading(true);
      setShowMenuDialog(false);
      try {
        const items = Array.from(selectedItems).map(id => {
          const type = selectedItemTypes.get(id);
          return type === 'recipe'
            ? { recipe_id: id, category: 'Uncategorized' }
            : { dish_id: id, category: 'Uncategorized' };
        });
        const response = await fetch(`/api/menus/${menuId}/items/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items }),
        });
        const result = await response.json();
        if (!response.ok) {
          showError(result.message || result.error || 'Failed to add items to menu');
          return;
        }
        const count = selectedItems.size;
        showSuccess(
          `${count} item${count > 1 ? 's' : ''} added to menu successfully! Opening menu editor...`,
        );
        router.push(`/webapp/menu-builder?menuId=${menuId}`);
        onSuccess?.();
      } catch (err) {
        logger.error('Bulk add to menu failed:', err);
        showError('Failed to add items to menu. Please check your connection and try again.');
      } finally {
        setAddLoading(false);
      }
    },
    [selectedItems, selectedItemTypes, router, showSuccess, showError, onSuccess],
  );
  const handleCreateNewMenu = useCallback(() => {
    setShowMenuDialog(false);
    router.push('/webapp/menu-builder');
  }, [router]);
  return {
    handleBulkAddToMenu,
    handleSelectMenu,
    handleCreateNewMenu,
    menus,
    loadingMenus,
    addLoading,
    showMenuDialog,
    setShowMenuDialog,
  };
}
