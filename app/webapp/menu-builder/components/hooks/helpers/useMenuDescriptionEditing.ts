/**
 * Hook for editing menu descriptions.
 */

import { useState, useRef, useEffect } from 'react';
import { useNotification } from '@/contexts/NotificationContext';
import { Menu } from '../../../types';
import { saveMenuDescription } from './saveMenuDescription';

interface UseMenuDescriptionEditingProps {
  menus: Menu[];
  setMenus?: (menus: Menu[] | ((prev: Menu[]) => Menu[])) => void;
  onMenuUpdated?: () => void;
}

/**
 * Hook for editing menu descriptions.
 *
 * @param {UseMenuDescriptionEditingProps} props - Hook dependencies
 * @returns {Object} Description editing handlers and state
 */
export function useMenuDescriptionEditing({
  menus,
  setMenus,
  onMenuUpdated,
}: UseMenuDescriptionEditingProps) {
  const { showError, showSuccess } = useNotification();
  const [editingMenuId, setEditingMenuId] = useState<string | null>(null);
  const [editDescription, setEditDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const descriptionInputRef = useRef<HTMLTextAreaElement>(null);

  // Focus input when editing starts
  useEffect(() => {
    if (editingMenuId && descriptionInputRef.current) {
      descriptionInputRef.current.focus();
      descriptionInputRef.current.select();
    }
  }, [editingMenuId]);

  const handleStartEditDescription = (menu: Menu, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingMenuId(menu.id);
    setEditDescription(menu.description || '');
  };

  const handleCancelEdit = () => {
    setEditingMenuId(null);
    setEditDescription('');
  };

  const handleSaveDescription = async (menu: Menu) => {
    await saveMenuDescription({
      menu,
      trimmedDescription: editDescription.trim(),
      setMenus,
      onMenuUpdated,
      handleCancelEdit,
      setIsSaving,
      showError,
      showSuccess,
    });
  };

  const handleDescriptionKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Escape') {
      handleCancelEdit();
    }
    // Allow Enter for multi-line descriptions
  };

  return {
    editingMenuId,
    editDescription,
    isSaving,
    descriptionInputRef,
    handleStartEditDescription,
    handleCancelEdit,
    handleSaveDescription,
    handleDescriptionKeyDown,
    setEditDescription,
  };
}
