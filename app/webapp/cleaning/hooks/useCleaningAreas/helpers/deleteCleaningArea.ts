/**
 * Helper function for deleting a cleaning area with optimistic updates
 */

import { cacheData } from '@/lib/cache/data-cache';
import { logger } from '@/lib/logger';
import type { CleaningArea } from '../types';

interface DeleteCleaningAreaParams {
  areaId: string;
  areas: CleaningArea[];
  setAreas: React.Dispatch<React.SetStateAction<CleaningArea[]>>;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
  onTaskRefresh?: () => void;
}

export async function deleteCleaningArea({
  areaId,
  areas,
  setAreas,
  onSuccess,
  onError,
  onTaskRefresh,
}: DeleteCleaningAreaParams): Promise<{ success: boolean; error?: string }> {
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
      onSuccess('Cleaning area deleted successfully');
      // Refresh tasks in case any were deleted
      onTaskRefresh?.();
      return { success: true };
    } else {
      // Revert optimistic update on error
      setAreas(originalAreas);
      onError(result.error || result.message || 'Failed to delete area');
      return { success: false, error: result.error || result.message };
    }
  } catch (err) {
    // Revert optimistic update on error
    setAreas(originalAreas);
    logger.error('Error deleting area:', err);
    onError('Failed to delete area. Please check your connection and try again.');
    return { success: false, error: 'Failed to delete area' };
  }
}



