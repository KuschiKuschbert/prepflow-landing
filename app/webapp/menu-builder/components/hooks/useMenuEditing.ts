/**
 * Hook for managing menu editing state and operations.
 * Orchestrates specialized hooks for title and description editing.
 */
import { useCallback, useMemo, useRef } from 'react';
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
 */
export function useMenuEditing({ menus, setMenus, onMenuUpdated }: UseMenuEditingProps) {
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
  const editingMenuId = titleEditingMenuId || descEditingMenuId || null;
  const editingField: 'title' | 'description' | null = titleEditingMenuId ? 'title' : descEditingMenuId ? 'description' : null;
  const handleStartEditTitle = useCallback((menu: Menu, e: React.MouseEvent) => {
    titleEditingRef.current.handleStartEditTitle(menu, e);
  }, []);
  const handleStartEditDescription = useCallback((menu: Menu, e: React.MouseEvent) => {
    descriptionEditingRef.current.handleStartEditDescription(menu, e);
  }, []);
  const handleCancelEdit = useCallback(() => {
    titleEditingRef.current.handleCancelEdit();
    descriptionEditingRef.current.handleCancelEdit();
  }, []);
  const handleSaveTitle = useCallback((menu: Menu) => {
    titleEditingRef.current.handleSaveTitle(menu);
  }, []);
  const handleSaveDescription = useCallback((menu: Menu) => {
    descriptionEditingRef.current.handleSaveDescription(menu);
  }, []);
  const handleTitleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>, menu: Menu) => {
    titleEditingRef.current.handleTitleKeyDown(e, menu);
  }, []);
  const handleDescriptionKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    descriptionEditingRef.current.handleDescriptionKeyDown(e);
  }, []);
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
