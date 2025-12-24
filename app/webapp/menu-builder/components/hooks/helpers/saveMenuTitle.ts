/**
 * Helper function for saving menu title.
 */

import { Menu } from '../../../types';
import { logger } from '@/lib/logger';

interface SaveMenuTitleProps {
  menu: Menu;
  trimmedTitle: string;
  setMenus?: (menus: Menu[] | ((prev: Menu[]) => Menu[])) => void;
  onMenuUpdated?: () => void;
  handleCancelEdit: () => void;
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
}

/**
 * Save menu title with optimistic updates.
 *
 * @param {SaveMenuTitleProps} props - Save props
 */
export async function saveMenuTitle({
  menu,
  trimmedTitle,
  setMenus,
  onMenuUpdated,
  handleCancelEdit,
  showError,
  showSuccess,
}: SaveMenuTitleProps): Promise<void> {
  if (!trimmedTitle) {
    showError('Menu name cannot be empty');
    handleCancelEdit();
    return;
  }

  if (trimmedTitle === menu.menu_name) {
    handleCancelEdit();
    return;
  }

  // Store original state for rollback
  const originalMenu = { ...menu };

  // Optimistically update UI immediately
  if (setMenus) {
    setMenus(prevMenus =>
      prevMenus.map(m => (m.id === menu.id ? { ...m, menu_name: trimmedTitle } : m)),
    );
  }

  try {
    const response = await fetch(`/api/menus/${menu.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ menu_name: trimmedTitle }),
    });

    const result = await response.json();

    if (response.ok) {
      showSuccess('Menu name updated');
      handleCancelEdit();
      onMenuUpdated?.();
    } else {
      // Revert optimistic update on error
      if (setMenus) {
        setMenus(prevMenus => prevMenus.map(m => (m.id === menu.id ? originalMenu : m)));
      }
      const errorMsg = result.error || result.message || 'Unknown error';
      showError(`Failed to update menu name: ${errorMsg}`);
    }
  } catch (err) {
    logger.error('[saveMenuTitle.ts] Error in catch block:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    });

    // Revert optimistic update on error
    if (setMenus) {
      setMenus(prevMenus => prevMenus.map(m => (m.id === menu.id ? originalMenu : m)));
    }
    showError('Failed to update menu name. Please try again.');
  }
}
