/**
 * Helper function for saving menu description.
 */

import { Menu } from '../../../types';
import { logger } from '@/lib/logger';

interface SaveMenuDescriptionProps {
  menu: Menu;
  trimmedDescription: string;
  setMenus?: (menus: Menu[] | ((prev: Menu[]) => Menu[])) => void;
  onMenuUpdated?: () => void;
  handleCancelEdit: () => void;
  setIsSaving: (saving: boolean) => void;
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
}

/**
 * Save menu description with optimistic updates.
 *
 * @param {SaveMenuDescriptionProps} props - Save props
 */
export async function saveMenuDescription({
  menu,
  trimmedDescription,
  setMenus,
  onMenuUpdated,
  handleCancelEdit,
  setIsSaving,
  showError,
  showSuccess,
}: SaveMenuDescriptionProps): Promise<void> {
  if (trimmedDescription === (menu.description || '')) {
    handleCancelEdit();
    return;
  }

  // Store original state for rollback
  const originalMenu = { ...menu };

  // Optimistically update UI immediately
  if (setMenus) {
    setMenus((prevMenus: Menu[]) =>
      prevMenus.map(m =>
        m.id === menu.id ? { ...m, description: trimmedDescription || undefined } : m,
      ),
    );
  }

  setIsSaving(true);

  try {
    const response = await fetch(`/api/menus/${menu.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description: trimmedDescription || null }),
    });

    const result = await response.json();

    if (response.ok) {
      showSuccess('Menu description updated');
      handleCancelEdit();
      onMenuUpdated?.();
    } else {
      // Revert optimistic update on error
      if (setMenus) {
        setMenus(prevMenus => prevMenus.map(m => (m.id === menu.id ? originalMenu : m)));
      }
      const errorMsg = result.error || result.message || 'Unknown error';
      showError(`Failed to update menu description: ${errorMsg}`);
    }
  } catch (err) {
    logger.error('[saveMenuDescription.ts] Error in catch block:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    });

    // Revert optimistic update on error
    if (setMenus) {
      setMenus(prevMenus => prevMenus.map(m => (m.id === menu.id ? originalMenu : m)));
    }
    showError('Failed to update menu description. Please try again.');
  } finally {
    setIsSaving(false);
  }
}
