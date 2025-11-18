/**
 * Hook for editing menu titles.
 */

import { useState, useRef, useEffect } from 'react';
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
  menus,
  setMenus,
  onMenuUpdated,
}: UseMenuTitleEditingProps) {
  const { showError, showSuccess } = useNotification();
  const [editingMenuId, setEditingMenuId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);

  // Focus input when editing starts
  useEffect(() => {
    if (editingMenuId && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [editingMenuId]);

  const handleStartEditTitle = (menu: Menu, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingMenuId(menu.id);
    setEditTitle(menu.menu_name);
  };

  const handleCancelEdit = () => {
    setEditingMenuId(null);
    setEditTitle('');
  };

  const handleSaveTitle = async (menu: Menu) => {
    await saveMenuTitle({
      menu,
      trimmedTitle: editTitle.trim(),
      setMenus,
      onMenuUpdated,
      handleCancelEdit,
      setIsSaving,
      showError,
      showSuccess,
    });
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, menu: Menu) => {
    if (e.key === 'Enter') {
      handleSaveTitle(menu);
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

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
