'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useNotification } from '@/contexts/NotificationContext';
import { Menu, MenuItem } from '../types';
import { EmptyMenuList } from './EmptyMenuList';
import { useMenuDeletion } from './hooks/useMenuDeletion';
import { useMenuEditing } from './hooks/useMenuEditing';
import { MenuCard } from './MenuCard';
import { printMenu } from '../utils/menuPrintUtils';
import { logger } from '@/lib/logger';

interface MenuListProps {
  menus: Menu[];
  onSelectMenu: (menu: Menu) => void;
  onEditMenu: (menu: Menu) => void;
  onDeleteMenu: (deletedMenuId: string) => void;
  onMenuUpdated?: () => void;
  setMenus?: (menus: Menu[] | ((prev: Menu[]) => Menu[])) => void;
}

/**
 * Menu list component displaying all menus with editing and deletion capabilities.
 *
 * @component
 * @param {MenuListProps} props - Component props
 * @returns {JSX.Element} Menu list element
 */
export default function MenuList({
  menus,
  onSelectMenu,
  onEditMenu,
  onDeleteMenu,
  onMenuUpdated,
  setMenus,
}: MenuListProps) {
  const editing = useMenuEditing({ menus, setMenus, onMenuUpdated });
  const deletion = useMenuDeletion({ menus, setMenus, onDeleteMenu });
  const { showError, showInfo } = useNotification();
  const [printingMenuId, setPrintingMenuId] = useState<string | null>(null);

  // Debug logging for menu lock status
  useEffect(() => {
    const lockedMenus = menus.filter(m => m.is_locked);
    if (lockedMenus.length > 0) {
      logger.dev('[MenuList] Locked menus detected', {
        lockedCount: lockedMenus.length,
        lockedMenuIds: lockedMenus.map(m => m.id),
        lockedMenuNames: lockedMenus.map(m => m.menu_name),
      });
    }
  }, [menus]);

  // Use ref to access deletion.setMenuToDelete without depending on deletion object
  const deletionRef = useRef(deletion);
  deletionRef.current = deletion;

  // Memoize cancel handler using ref to avoid dependency on changing deletion object
  const handleCancelDelete = useCallback(() => {
    deletionRef.current.setMenuToDelete(null);
  }, []); // Empty deps - use ref for setMenuToDelete

  /**
   * Handle print menu action.
   *
   * Follows prep-lists pattern: synchronous, instant print.
   * Fetches menu data first, then prints immediately (no AI generation).
   *
   * @param {Menu} menu - Menu to print
   */
  const handlePrintMenu = useCallback(
    async (menu: Menu) => {
      if (printingMenuId === menu.id) {
        return; // Already printing
      }

      setPrintingMenuId(menu.id);

      try {
        // Fetch menu with items (quick fetch, no AI generation)
        const response = await fetch(`/api/menus/${menu.id}`, { cache: 'no-store' });
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || errorData.message || 'Failed to fetch menu data');
        }

        const result = await response.json();
        if (!result.success || !result.menu) {
          throw new Error(result.error || result.message || 'Failed to load menu');
        }

        const menuData = result.menu;
        const menuItems: MenuItem[] = menuData.items || [];

        if (menuItems.length === 0) {
          showError('This menu has no items to print.');
          return;
        }

        // Print immediately (synchronous, instant - same pattern as prep-lists)
        printMenu(menuData, menuItems);
      } catch (error) {
        logger.error('[MenuList] Print error:', error);
        showError(
          error instanceof Error
            ? error.message
            : 'Failed to print menu. Please check your connection and try again.',
        );
      } finally {
        setPrintingMenuId(null);
      }
    },
    [printingMenuId, showError],
  );

  if (menus.length === 0) {
    return <EmptyMenuList />;
  }

  return (
    <div className="tablet:grid-cols-2 desktop:grid-cols-3 grid gap-4 overflow-visible">
      {menus.map(menu => {
        const isEditingThisMenu = editing.editingMenuId === menu.id;
        const isEditingTitle = isEditingThisMenu && editing.editingField === 'title';
        const isEditingDescription = isEditingThisMenu && editing.editingField === 'description';

        return (
          <MenuCard
            key={menu.id}
            menu={menu}
            isEditingThisMenu={isEditingThisMenu}
            isEditingTitle={isEditingTitle}
            isEditingDescription={isEditingDescription}
            editTitle={editing.editTitle}
            editDescription={editing.editDescription}
            isSaving={editing.isSaving}
            titleInputRef={editing.titleInputRef}
            descriptionInputRef={editing.descriptionInputRef}
            onSelectMenu={onSelectMenu}
            onStartEditTitle={editing.handleStartEditTitle}
            onStartEditDescription={editing.handleStartEditDescription}
            onSaveTitle={editing.handleSaveTitle}
            onSaveDescription={editing.handleSaveDescription}
            onCancelEdit={editing.handleCancelEdit}
            onTitleKeyDown={editing.handleTitleKeyDown}
            onDescriptionKeyDown={editing.handleDescriptionKeyDown}
            onDeleteClick={deletion.handleDeleteClick}
            setEditTitle={editing.setEditTitle}
            setEditDescription={editing.setEditDescription}
            onPrintClick={handlePrintMenu}
          />
        );
      })}
      <ConfirmDialog
        isOpen={!!deletion.menuToDelete && !deletion.menuToDelete.is_locked}
        title="86 This Menu?"
        message={
          deletion.menuToDelete && !deletion.menuToDelete.is_locked
            ? `Ready to 86 "${deletion.menuToDelete.menu_name}"? This menu's going in the bin - no ceremony needed. This can't be undone, chef!`
            : ''
        }
        confirmLabel="86 It"
        cancelLabel="Cancel"
        onConfirm={deletion.confirmDelete}
        onCancel={handleCancelDelete}
        variant="danger"
      />
    </div>
  );
}
