'use client';

import { useCallback } from 'react';
import { useNotification } from '@/contexts/NotificationContext';
import { useConfirm } from '@/hooks/useConfirm';
import { addCleaningArea } from './useCleaningAreas/helpers/addCleaningArea';
import { deleteCleaningArea } from './useCleaningAreas/helpers/deleteCleaningArea';
import type { CleaningArea } from './useCleaningAreas/types';

interface UseCleaningAreasProps {
  areas: CleaningArea[];
  setAreas: React.Dispatch<React.SetStateAction<CleaningArea[]>>;
  onTaskRefresh?: () => void;
}

/**
 * Hook for managing cleaning areas CRUD operations with optimistic updates
 */
export function useCleaningAreas({ areas, setAreas, onTaskRefresh }: UseCleaningAreasProps) {
  const { showSuccess, showError } = useNotification();
  const { showConfirm, ConfirmDialog: ConfirmDialogFromHook } = useConfirm();

  const handleAddArea = useCallback(
    async (newArea: { area_name: string; description: string; cleaning_frequency: string }) => {
      return addCleaningArea({
        newArea,
        areas,
        setAreas,
        onSuccess: showSuccess,
        onError: showError,
      });
    },
    [areas, setAreas, showSuccess, showError],
  );

  const handleDeleteArea = useCallback(
    async (areaId: string) => {
      const area = areas.find(a => a.id === areaId);
      if (!area) return { success: false, error: 'Area not found' };

      const confirmed = await showConfirm({
        title: 'Delete Cleaning Area?',
        message: `Delete "${area.area_name}"? This will also delete all tasks assigned to this area. This action can't be undone.`,
        variant: 'danger',
        confirmLabel: 'Delete',
        cancelLabel: 'Cancel',
      });

      if (!confirmed) return { success: false, error: 'Cancelled' };

      return deleteCleaningArea({
        areaId,
        areas,
        setAreas,
        onSuccess: showSuccess,
        onError: showError,
        onTaskRefresh,
      });
    },
    [areas, setAreas, showConfirm, showSuccess, showError, onTaskRefresh],
  );

  return {
    handleAddArea,
    handleDeleteArea,
    ConfirmDialog: ConfirmDialogFromHook,
  };
}
