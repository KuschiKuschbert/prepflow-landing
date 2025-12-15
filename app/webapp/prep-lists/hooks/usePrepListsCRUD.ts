/**
 * Hook for managing prep list CRUD operations.
 */
import { useCallback, useState } from 'react';
import type { PrepList } from '../types';
import { performPrepListDelete } from './helpers/performPrepListDelete';
import { performPrepListStatusChange } from './helpers/performPrepListStatusChange';

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

  const handleDelete = useCallback(
    (id: string) => {
      const prepList = prepLists.find(list => list.id === id);
      setConfirmDialog({
        isOpen: true,
        title: 'Delete Prep List',
        message: `Are you sure you want to delete "${prepList?.name || 'this prep list'}"? This action can't be undone.`,
        onConfirm: async () => {
          setConfirmDialog(prev => ({ ...prev, isOpen: false }));
          await performPrepListDelete({
            id,
            prepLists,
            setPrepLists,
            refetchPrepLists,
            showError,
            showSuccess,
          });
        },
      });
    },
    [prepLists, setPrepLists, refetchPrepLists, showError, showSuccess],
  );

  const handleStatusChange = useCallback(
    async (id: string, status: string) => {
      await performPrepListStatusChange({
        id,
        status,
        prepLists,
        setPrepLists,
        refetchPrepLists,
        showError,
        showSuccess,
      });
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
