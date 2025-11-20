/**
 * Hook for managing par level CRUD operations.
 */
import { useState, useCallback } from 'react';
import { createOptimisticDelete, createOptimisticUpdate } from '@/lib/optimistic-updates';
import type { ParLevel } from '../types';

interface UseParLevelsCRUDProps {
  parLevels: ParLevel[];
  setParLevels: React.Dispatch<React.SetStateAction<ParLevel[]>>;
  fetchParLevels: () => Promise<void>;
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
}

/**
 * Hook for managing par level CRUD operations.
 */
export function useParLevelsCRUD({
  parLevels,
  setParLevels,
  fetchParLevels,
  showError,
  showSuccess,
}: UseParLevelsCRUDProps) {
  const [editingParLevel, setEditingParLevel] = useState<ParLevel | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const handleUpdate = useCallback(
    async (updates: Partial<ParLevel>) => {
      if (!updates.id) return;
      await createOptimisticUpdate(
        parLevels,
        updates.id,
        updates,
        () =>
          fetch('/api/par-levels', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: updates.id, parLevel: updates.par_level, reorderPoint: updates.reorder_point, unit: updates.unit }),
          }),
        setParLevels,
        () => {
          showSuccess('Par level updated successfully');
          fetchParLevels();
        },
        showError,
      );
    },
    [parLevels, setParLevels, fetchParLevels, showError, showSuccess],
  );
  const handleEdit = useCallback((parLevel: ParLevel) => {
    setEditingParLevel(parLevel);
  }, []);
  const handleDelete = useCallback(
    async (id: string): Promise<void> => {
      const parLevelToDelete = parLevels.find(pl => pl.id === id);
      if (!parLevelToDelete) return;

      await createOptimisticDelete(
        parLevels,
        id,
        () => fetch(`/api/par-levels?id=${id}`, { method: 'DELETE' }),
        setParLevels,
        () => {
          showSuccess('Par level deleted successfully');
          fetchParLevels();
        },
        showError,
      );
    },
    [parLevels, setParLevels, fetchParLevels, showSuccess, showError],
  );
  const handleDeleteClick = useCallback((id: string) => {
    setDeleteConfirmId(id);
    setShowDeleteConfirm(true);
  }, []);
  const confirmDelete = useCallback(async () => {
    if (!deleteConfirmId) return;
    await handleDelete(deleteConfirmId);
    setShowDeleteConfirm(false);
    setDeleteConfirmId(null);
  }, [deleteConfirmId, handleDelete]);
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
    handleUpdate,
    handleEdit,
    handleDelete,
    handleDeleteClick,
    confirmDelete,
    cancelDelete,
    closeEditDrawer,
  };
}
