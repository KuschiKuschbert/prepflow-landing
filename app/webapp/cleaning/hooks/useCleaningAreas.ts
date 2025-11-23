'use client';

import { useState, useCallback } from 'react';
import { useNotification } from '@/contexts/NotificationContext';
import { useConfirm } from '@/hooks/useConfirm';
import { cacheData } from '@/lib/cache/data-cache';
import { logger } from '@/lib/logger';

interface CleaningArea {
  id: string;
  area_name: string;
  description?: string;
  cleaning_frequency?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

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
      const tempId = `temp-${Date.now()}`;
      const tempArea: CleaningArea = {
        id: tempId,
        area_name: newArea.area_name,
        description: newArea.description,
        cleaning_frequency: newArea.cleaning_frequency,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Store original state for rollback
      const originalAreas = [...areas];

      // Optimistically add to UI immediately
      setAreas(prevAreas => [...prevAreas, tempArea]);

      try {
        const response = await fetch('/api/cleaning-areas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newArea),
        });

        const result = await response.json();

        if (response.ok && result.success && result.data) {
          // Replace temp area with real area from server
          setAreas(prevAreas => {
            const updated = prevAreas.map(a => (a.id === tempId ? result.data : a));
            cacheData('cleaning_areas', updated);
            return updated;
          });
          showSuccess('Cleaning area created successfully');
          return { success: true, data: result.data };
        } else {
          // Revert optimistic update on error
          setAreas(originalAreas);
          showError(result.error || result.message || 'Failed to create cleaning area');
          return { success: false, error: result.error || result.message };
        }
      } catch (err) {
        // Revert optimistic update on error
        setAreas(originalAreas);
        logger.error('Error creating area:', err);
        showError('Failed to create cleaning area. Please check your connection and try again.');
        return { success: false, error: 'Failed to create cleaning area' };
      }
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

      // Store original state for rollback
      const originalAreas = [...areas];

      // Optimistically remove from UI immediately
      setAreas(prevAreas => prevAreas.filter(a => a.id !== areaId));

      try {
        const response = await fetch(`/api/cleaning-areas?id=${areaId}`, {
          method: 'DELETE',
        });

        const result = await response.json();

        if (response.ok && result.success) {
          setAreas(prevAreas => {
            const updated = prevAreas.filter(a => a.id !== areaId);
            cacheData('cleaning_areas', updated);
            return updated;
          });
          showSuccess('Cleaning area deleted successfully');
          // Refresh tasks in case any were deleted
          onTaskRefresh?.();
          return { success: true };
        } else {
          // Revert optimistic update on error
          setAreas(originalAreas);
          showError(result.error || result.message || 'Failed to delete area');
          return { success: false, error: result.error || result.message };
        }
      } catch (err) {
        // Revert optimistic update on error
        setAreas(originalAreas);
        logger.error('Error deleting area:', err);
        showError('Failed to delete area. Please check your connection and try again.');
        return { success: false, error: 'Failed to delete area' };
      }
    },
    [areas, setAreas, showConfirm, showSuccess, showError, onTaskRefresh],
  );

  return {
    handleAddArea,
    handleDeleteArea,
    ConfirmDialog: ConfirmDialogFromHook,
  };
}
