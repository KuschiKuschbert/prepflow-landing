'use client';

import { useCallback, useRef } from 'react';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Menu } from '../types';
import { EmptyMenuList } from './EmptyMenuList';
import { useMenuDeletion } from './hooks/useMenuDeletion';
import { useMenuEditing } from './hooks/useMenuEditing';
import { MenuCard } from './MenuCard';

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

  // Use ref to access deletion.setMenuToDelete without depending on deletion object
  const deletionRef = useRef(deletion);
  deletionRef.current = deletion;

  // Memoize cancel handler using ref to avoid dependency on changing deletion object
  const handleCancelDelete = useCallback(() => {
    deletionRef.current.setMenuToDelete(null);
  }, []); // Empty deps - use ref for setMenuToDelete

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
