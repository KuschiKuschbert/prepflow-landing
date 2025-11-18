/**
 * Hook for managing menu editing state and operations.
 * Orchestrates specialized hooks for title and description editing.
 */

import { useState } from 'react';
import { Menu } from '../../types';
import { useMenuTitleEditing } from './helpers/useMenuTitleEditing';
import { useMenuDescriptionEditing } from './helpers/useMenuDescriptionEditing';

interface UseMenuEditingProps {
  menus: Menu[];
  setMenus?: (menus: Menu[] | ((prev: Menu[]) => Menu[])) => void;
  onMenuUpdated?: () => void;
}

/**
 * Hook for managing menu editing state and operations.
 *
 * @param {UseMenuEditingProps} props - Hook props
 * @returns {Object} Editing state and handlers
 */
export function useMenuEditing({ menus, setMenus, onMenuUpdated }: UseMenuEditingProps) {
  const [editingField, setEditingField] = useState<'title' | 'description' | null>(null);

  // Delegate to specialized hooks
  const titleEditing = useMenuTitleEditing({
    menus,
    setMenus,
    onMenuUpdated,
  });

  const descriptionEditing = useMenuDescriptionEditing({
    menus,
    setMenus,
    onMenuUpdated,
  });

  // Update editingField based on which hook is active
  const editingMenuId = titleEditing.editingMenuId || descriptionEditing.editingMenuId || null;
  if (editingMenuId && titleEditing.editingMenuId) {
    setEditingField('title');
  } else if (editingMenuId && descriptionEditing.editingMenuId) {
    setEditingField('description');
  } else if (!editingMenuId) {
    setEditingField(null);
  }

  const handleStartEditTitle = (menu: Menu, e: React.MouseEvent) => {
    titleEditing.handleStartEditTitle(menu, e);
    setEditingField('title');
  };

  const handleStartEditDescription = (menu: Menu, e: React.MouseEvent) => {
    descriptionEditing.handleStartEditDescription(menu, e);
    setEditingField('description');
  };

  const handleCancelEdit = () => {
    titleEditing.handleCancelEdit();
    descriptionEditing.handleCancelEdit();
    setEditingField(null);
  };

  return {
    editingMenuId,
    editingField,
    editTitle: titleEditing.editTitle,
    editDescription: descriptionEditing.editDescription,
    isSaving: titleEditing.isSaving || descriptionEditing.isSaving,
    titleInputRef: titleEditing.titleInputRef,
    descriptionInputRef: descriptionEditing.descriptionInputRef,
    handleStartEditTitle,
    handleStartEditDescription,
    handleCancelEdit,
    handleSaveTitle: titleEditing.handleSaveTitle,
    handleSaveDescription: descriptionEditing.handleSaveDescription,
    handleTitleKeyDown: titleEditing.handleTitleKeyDown,
    handleDescriptionKeyDown: descriptionEditing.handleDescriptionKeyDown,
    setEditTitle: titleEditing.setEditTitle,
    setEditDescription: descriptionEditing.setEditDescription,
  };
}
