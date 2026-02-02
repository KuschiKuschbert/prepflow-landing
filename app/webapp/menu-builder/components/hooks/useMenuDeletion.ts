import { useState, useCallback, useMemo } from 'react';
import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';
import { Menu } from '@/lib/types/menu-builder';

interface UseMenuDeletionProps {
  menus: Menu[];
  setMenus?: (menus: Menu[] | ((prev: Menu[]) => Menu[])) => void;
  onDeleteMenu: (deletedMenuId: string) => void;
}

/**
 * Hook for managing menu deletion.
 *
 * @param {UseMenuDeletionProps} props - Hook props
 * @returns {Object} Deletion state and handlers
 */
export function useMenuDeletion({ menus, setMenus, onDeleteMenu }: UseMenuDeletionProps) {
  const { showError, showSuccess } = useNotification();
  const [menuToDelete, setMenuToDelete] = useState<Menu | null>(null);

  // Memoize handleDeleteClick - only uses setState, so empty deps
  const handleDeleteClick = useCallback(
    (menu: Menu) => {
      // Prevent deleting locked menus
      if (menu.is_locked) {
        showError('Cannot delete locked menu. Please unlock it first.');
        return;
      }
      setMenuToDelete(menu);
    },
    [showError],
  );

  // Memoize confirmDelete with proper dependencies
  const confirmDelete = useCallback(async () => {
    if (!menuToDelete) return;

    // Store original state for rollback
    const originalMenus = [...menus];
    const menuIdToDelete = menuToDelete.id;

    // Optimistically remove from UI immediately
    if (setMenus) {
      setMenus(prevMenus => prevMenus.filter(m => m.id !== menuIdToDelete));
    }

    try {
      const response = await fetch(`/api/menus/${menuIdToDelete}`, { method: 'DELETE' });
      const result = await response.json();

      if (response.ok) {
        setMenuToDelete(null);
        showSuccess('Menu deleted successfully');
        // Call onDeleteMenu with the deleted menu ID for parent component cleanup
        onDeleteMenu(menuIdToDelete);
      } else {
        // Revert optimistic update on error
        if (setMenus) {
          setMenus(originalMenus);
        }
        const errorMsg = result.error || result.message || 'Unknown error';
        showError(`Failed to delete menu: ${errorMsg}`);
        setMenuToDelete(null);
      }
    } catch (err) {
      // Revert optimistic update on error
      if (setMenus) {
        setMenus(originalMenus);
      }
      logger.error('Failed to delete menu:', err);
      showError('Failed to delete menu. Something went wrong - please try again.');
      setMenuToDelete(null);
    }
  }, [menuToDelete, menus, setMenus, onDeleteMenu, showError, showSuccess]);

  // Memoize return object to prevent MenuList re-renders
  return useMemo(
    () => ({
      menuToDelete,
      setMenuToDelete,
      handleDeleteClick,
      confirmDelete,
    }),
    [menuToDelete, handleDeleteClick, confirmDelete],
  );
}
