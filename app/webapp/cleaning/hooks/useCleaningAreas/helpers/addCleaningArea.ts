/**
 * Helper function for adding a cleaning area with optimistic updates
 */

import { cacheData } from '@/lib/cache/data-cache';
import { logger } from '@/lib/logger';
import type { CleaningArea } from '../types';

interface AddCleaningAreaParams {
  newArea: { area_name: string; description: string; cleaning_frequency: string };
  areas: CleaningArea[];
  setAreas: React.Dispatch<React.SetStateAction<CleaningArea[]>>;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

export async function addCleaningArea({
  newArea,
  areas,
  setAreas,
  onSuccess,
  onError,
}: AddCleaningAreaParams): Promise<{ success: boolean; data?: CleaningArea; error?: string }> {
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
      onSuccess('Cleaning area created successfully');
      return { success: true, data: result.data };
    } else {
      // Revert optimistic update on error
      setAreas(originalAreas);
      onError(result.error || result.message || 'Failed to create cleaning area');
      return { success: false, error: result.error || result.message };
    }
  } catch (err) {
    // Revert optimistic update on error
    setAreas(originalAreas);
    logger.error('Error creating area:', err);
    onError('Failed to create cleaning area. Please check your connection and try again.');
    return { success: false, error: 'Failed to create cleaning area' };
  }
}
