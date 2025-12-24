/**
 * Hook for editing menu descriptions.
 */

import { useState, useRef, useEffect, useCallback } from 'react';
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

  const handleStartEditDescription = useCallback(
    (menu: Menu, e: React.MouseEvent) => {
      e.stopPropagation();
      // Prevent editing locked menus
      if (menu.is_locked) {
        showError('Cannot edit locked menu. Please unlock it first.');
        return;
      }
      setEditingMenuId(menu.id);
      setEditDescription(menu.description || '');
    },
    [showError], // Stable - only uses setState functions
  );

  const handleCancelEdit = useCallback(() => {
    setEditingMenuId(null);
    setEditDescription('');
  }, []); // Stable - only uses setState functions

  const handleSaveDescription = useCallback(
    async (menu: Menu) => {
      await saveMenuDescription({
        menu,
        trimmedDescription: editDescription.trim(),
        setMenus,
        onMenuUpdated,
        handleCancelEdit,
        showError,
        showSuccess,
      });
    },
    [editDescription, setMenus, onMenuUpdated, handleCancelEdit, showError, showSuccess],
  );

  const handleDescriptionKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Escape') {
        handleCancelEdit();
      }
      // Allow Enter for multi-line descriptions
    },
    [handleCancelEdit],
  );

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
