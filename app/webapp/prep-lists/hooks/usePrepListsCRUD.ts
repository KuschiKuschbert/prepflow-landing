/**
 * Hook for managing prep list CRUD operations.
 */
import { logger } from '@/lib/logger';
import { useCallback, useState } from 'react';
import type { PrepList } from '../types';

interface UsePrepListsCRUDProps {
  prepLists: PrepList[];
  setPrepLists: React.Dispatch<React.SetStateAction<PrepList[]>>;
  refetchPrepLists: () => Promise<unknown>;
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
}

/**
 * Hook for managing prep list CRUD operations.
 */
export function usePrepListsCRUD({
  prepLists,
  setPrepLists,
  refetchPrepLists,
  showError,
  showSuccess,
}: UsePrepListsCRUDProps) {
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });
  const handleRefreshError = (err: any) => logger.error('Failed to refresh prep lists:', err);
  const performDelete = useCallback(
    async (id: string) => {
      const originalPrepLists = [...prepLists];
      const prepListToDelete = prepLists.find(list => list.id === id);
      if (!prepListToDelete) {
        showError('Prep list not found');
        return;
      }
      setPrepLists(prevLists => prevLists.filter(list => list.id !== id));

      try {
        const response = await fetch(`/api/prep-lists?id=${id}`, {
          method: 'DELETE',
        });

        const result = await response.json();

        if (result.success) {
          showSuccess('Prep list deleted successfully');
          refetchPrepLists().catch(handleRefreshError);
        } else {
          setPrepLists(originalPrepLists);
          showError(result.message || 'Failed to delete prep list');
        }
      } catch (err) {
        setPrepLists(originalPrepLists);
        logger.error('Failed to delete prep list:', err);
        showError('Failed to delete prep list. Please check your connection and try again.');
      }
    },
    [prepLists, setPrepLists, refetchPrepLists, showError, showSuccess],
  );
  const handleDelete = useCallback(
    (id: string) => {
      const prepList = prepLists.find(list => list.id === id);
      setConfirmDialog({
        isOpen: true,
        title: 'Delete Prep List',
        message: `Are you sure you want to delete "${prepList?.name || 'this prep list'}"? This action can't be undone.`,
        onConfirm: async () => {
          setConfirmDialog(prev => ({ ...prev, isOpen: false }));
          await performDelete(id);
        },
      });
    },
    [prepLists, performDelete],
  );
  const handleStatusChange = useCallback(
    async (id: string, status: string) => {
      const originalPrepLists = [...prepLists];
      const prepListToUpdate = prepLists.find(list => list.id === id);
      if (!prepListToUpdate) {
        showError('Prep list not found');
        return;
      }
      setPrepLists(prevLists =>
        prevLists.map(list => (list.id === id ? { ...list, status: status as any } : list)),
      );

      try {
        const response = await fetch('/api/prep-lists', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, status }),
        });

        const result = await response.json();

        if (result.success) {
          showSuccess('Status updated successfully');
          refetchPrepLists().catch(handleRefreshError);
        } else {
          setPrepLists(originalPrepLists);
          showError(result.message || 'Failed to update status');
        }
      } catch (err) {
        setPrepLists(originalPrepLists);
        logger.error('Failed to update status:', err);
        showError('Failed to update status. Please check your connection and try again.');
      }
    },
    [prepLists, setPrepLists, refetchPrepLists, showError, showSuccess],
  );
  const cancelConfirmDialog = useCallback(() => {
    setConfirmDialog(prev => ({ ...prev, isOpen: false }));
  }, []);

  return {
    confirmDialog,
    handleDelete,
    handleStatusChange,
    cancelConfirmDialog,
  };
}
