/**
 * Hook for managing par level CRUD operations.
 */
import { useCallback, useState } from 'react';
import type { ParLevel } from '../types';
import { handleDelete } from './useParLevelsCRUD/helpers/handleDelete';
import { handleUpdate } from './useParLevelsCRUD/helpers/handleUpdate';

interface UseParLevelsCRUDProps {
  parLevels: ParLevel[];
  setParLevels: React.Dispatch<React.SetStateAction<ParLevel[]>>;
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
}

/**
 * Hook for managing par level CRUD operations.
 */
export function useParLevelsCRUD({
  parLevels,
  setParLevels,
  showError,
  showSuccess,
}: UseParLevelsCRUDProps) {
  const [editingParLevel, setEditingParLevel] = useState<ParLevel | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const handleUpdateCallback = useCallback(
    async (updates: Partial<ParLevel>) => {
      await handleUpdate({
        updates,
        parLevels,
        setParLevels,
        showError,
        showSuccess,
      });
    },
    [parLevels, setParLevels, showError, showSuccess],
  );
  const handleEdit = useCallback((parLevel: ParLevel) => setEditingParLevel(parLevel), []);
  const handleDeleteCallback = useCallback(
    async (id: string): Promise<void> => {
      await handleDelete({
        id,
        parLevels,
        setParLevels,
        showError,
        showSuccess,
      });
    },
    [parLevels, setParLevels, showSuccess, showError],
  );
  const handleDeleteClick = useCallback((id: string) => {
    setDeleteConfirmId(id);
    setShowDeleteConfirm(true);
  }, []);
  const confirmDelete = useCallback(async () => {
    if (!deleteConfirmId) return;
    await handleDeleteCallback(deleteConfirmId);
    setShowDeleteConfirm(false);
    setDeleteConfirmId(null);
  }, [deleteConfirmId, handleDeleteCallback]);
  const cancelDelete = useCallback(() => {
    setShowDeleteConfirm(false);
    setDeleteConfirmId(null);
  }, []);
  const closeEditDrawer = useCallback(() => {
    setEditingParLevel(null);
  }, []);
  return {
    editingParLevel,
    showDeleteConfirm,
    deleteConfirmId,
    handleUpdate: handleUpdateCallback,
    handleEdit,
    handleDelete: handleDeleteCallback,
    handleDeleteClick,
    confirmDelete,
    cancelDelete,
    closeEditDrawer,
  };
}
