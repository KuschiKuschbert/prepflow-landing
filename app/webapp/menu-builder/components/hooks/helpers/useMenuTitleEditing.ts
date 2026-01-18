/**
 * Hook for editing menu titles.
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { useNotification } from '@/contexts/NotificationContext';
import { Menu } from '../../../types';
import { saveMenuTitle } from './saveMenuTitle';

interface UseMenuTitleEditingProps {
  menus: Menu[];
  setMenus?: (menus: Menu[] | ((prev: Menu[]) => Menu[])) => void;
  onMenuUpdated?: () => void;
}

/**
 * Hook for editing menu titles.
 *
 * @param {UseMenuTitleEditingProps} props - Hook dependencies
 * @returns {Object} Title editing handlers and state
 */
export function useMenuTitleEditing({
  menus: _menus,
  setMenus,
  onMenuUpdated,
}: UseMenuTitleEditingProps) {
  const { showError, showSuccess } = useNotification();
  const [editingMenuId, setEditingMenuId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [isSaving, _setIsSaving] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);

  // Focus input when editing starts
  useEffect(() => {
    if (editingMenuId && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [editingMenuId]);

  const handleStartEditTitle = useCallback(
    (menu: Menu, e: React.MouseEvent) => {
      e.stopPropagation();
      // Prevent editing locked menus
      if (menu.is_locked) {
        showError('Cannot edit locked menu. Please unlock it first.');
        return;
      }
      setEditingMenuId(menu.id);
      setEditTitle(menu.menu_name);
    },
    [showError], // Stable - only uses setState functions
  );

  const handleCancelEdit = useCallback(() => {
    setEditingMenuId(null);
    setEditTitle('');
  }, []); // Stable - only uses setState functions

  const handleSaveTitle = useCallback(
    async (menu: Menu) => {
      await saveMenuTitle({
        menu,
        trimmedTitle: editTitle.trim(),
        setMenus,
        onMenuUpdated,
        handleCancelEdit,
        showError,
        showSuccess,
      });
    },
    [editTitle, setMenus, onMenuUpdated, handleCancelEdit, showError, showSuccess],
  );

  const handleTitleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>, menu: Menu) => {
      if (e.key === 'Enter') {
        handleSaveTitle(menu);
      } else if (e.key === 'Escape') {
        handleCancelEdit();
      }
    },
    [handleSaveTitle, handleCancelEdit],
  );

  return {
    editingMenuId,
    editTitle,
    isSaving,
    titleInputRef,
    handleStartEditTitle,
    handleCancelEdit,
    handleSaveTitle,
    handleTitleKeyDown,
    setEditTitle,
  };
}
