/**
 * Hook for managing menu editing state and operations.
 * Orchestrates specialized hooks for title and description editing.
 */
import { useMemo, useRef } from 'react';
import type { Menu } from '@/lib/types/menu-builder';
import { useMenuDescriptionEditing } from './helpers/useMenuDescriptionEditing';
import { useMenuTitleEditing } from './helpers/useMenuTitleEditing';
import { createEditingState } from './useMenuEditing/helpers/createEditingState';
import { createHandlers } from './useMenuEditing/helpers/createHandlers';

interface UseMenuEditingProps {
  menus: Menu[];
  setMenus?: (menus: Menu[] | ((prev: Menu[]) => Menu[])) => void;
  onMenuUpdated?: () => void;
}

/**
 * Hook for managing menu editing state and operations.
 */
export function useMenuEditing({ menus, setMenus, onMenuUpdated }: UseMenuEditingProps) {
  const titleEditing = useMenuTitleEditing({ menus, setMenus, onMenuUpdated });
  const descriptionEditing = useMenuDescriptionEditing({ menus, setMenus, onMenuUpdated });
  const titleEditingRef = useRef(titleEditing);
  const descriptionEditingRef = useRef(descriptionEditing);
  titleEditingRef.current = titleEditing;
  descriptionEditingRef.current = descriptionEditing;
  const {
    editingMenuId: titleEditingMenuId,
    editTitle,
    isSaving: titleIsSaving,
    titleInputRef,
    setEditTitle,
  } = titleEditing;
  const {
    editingMenuId: descEditingMenuId,
    editDescription,
    isSaving: descIsSaving,
    descriptionInputRef,
    setEditDescription,
  } = descriptionEditing;
  const { editingMenuId, editingField } = createEditingState({
    titleEditingMenuId,
    descEditingMenuId,
  });
  const {
    handleStartEditTitle,
    handleStartEditDescription,
    handleCancelEdit,
    handleSaveTitle,
    handleSaveDescription,
    handleTitleKeyDown,
    handleDescriptionKeyDown,
  } = createHandlers({ titleEditingRef, descriptionEditingRef });
  return useMemo(
    () => ({
      editingMenuId,
      editingField,
      editTitle,
      editDescription,
      isSaving: titleIsSaving || descIsSaving,
      titleInputRef,
      descriptionInputRef,
      handleStartEditTitle,
      handleStartEditDescription,
      handleCancelEdit,
      handleSaveTitle,
      handleSaveDescription,
      handleTitleKeyDown,
      handleDescriptionKeyDown,
      setEditTitle,
      setEditDescription,
    }),
    [
      editingMenuId,
      editingField,
      editTitle,
      editDescription,
      titleIsSaving,
      descIsSaving,
      titleInputRef,
      descriptionInputRef,
      setEditTitle,
      setEditDescription,
      handleStartEditTitle,
      handleStartEditDescription,
      handleCancelEdit,
      handleSaveTitle,
      handleSaveDescription,
      handleTitleKeyDown,
      handleDescriptionKeyDown,
    ],
  );
}
