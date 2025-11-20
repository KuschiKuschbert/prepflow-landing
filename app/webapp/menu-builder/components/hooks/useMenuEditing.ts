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
 *
 * @param {UseMenuEditingProps} props - Hook props
 * @returns {Object} Editing state and handlers
 */
export function useMenuEditing({ menus, setMenus, onMenuUpdated }: UseMenuEditingProps) {
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

  // Use refs to access handlers without including them in dependencies
  const titleEditingRef = useRef(titleEditing);
  const descriptionEditingRef = useRef(descriptionEditing);

  // Update refs synchronously during render (safe, doesn't cause re-renders)
  titleEditingRef.current = titleEditing;
  descriptionEditingRef.current = descriptionEditing;

  // Extract primitive values and refs (these are stable or change predictably)
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

  // Compute editingField directly from hook states (simple derived value, no memoization needed)
  const editingMenuId = titleEditingMenuId || descEditingMenuId || null;
  const editingField: 'title' | 'description' | null = titleEditingMenuId
    ? 'title'
    : descEditingMenuId
      ? 'description'
      : null;

  // Memoize handlers using refs to avoid dependency on changing handler functions
  const handleStartEditTitle = useCallback((menu: Menu, e: React.MouseEvent) => {
    titleEditingRef.current.handleStartEditTitle(menu, e);
  }, []); // Empty deps - use ref for handler

  const handleStartEditDescription = useCallback((menu: Menu, e: React.MouseEvent) => {
    descriptionEditingRef.current.handleStartEditDescription(menu, e);
  }, []); // Empty deps - use ref for handler

  const handleCancelEdit = useCallback(() => {
    titleEditingRef.current.handleCancelEdit();
    descriptionEditingRef.current.handleCancelEdit();
  }, []); // Empty deps - use refs for handlers

  const handleSaveTitle = useCallback((menu: Menu) => {
    titleEditingRef.current.handleSaveTitle(menu);
  }, []); // Empty deps - use ref for handler

  const handleSaveDescription = useCallback((menu: Menu) => {
    descriptionEditingRef.current.handleSaveDescription(menu);
  }, []); // Empty deps - use ref for handler

  const handleTitleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>, menu: Menu) => {
    titleEditingRef.current.handleTitleKeyDown(e, menu);
  }, []); // Empty deps - use ref for handler

  const handleDescriptionKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    descriptionEditingRef.current.handleDescriptionKeyDown(e);
  }, []); // Empty deps - use ref for handler

  // Memoize return object - only depend on primitive values, not handler functions
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
