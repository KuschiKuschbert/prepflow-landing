/**
 * Handle par level update operation.
 */
import { createOptimisticUpdate } from '@/lib/optimistic-updates';
import type { ParLevel } from '../../../types';

interface HandleUpdateParams {
  updates: Partial<ParLevel>;
  parLevels: ParLevel[];
  setParLevels: React.Dispatch<React.SetStateAction<ParLevel[]>>;
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
}

export async function handleUpdate({
  updates,
  parLevels,
  setParLevels,
  showError,
  showSuccess,
}: HandleUpdateParams): Promise<void> {
  if (!updates.id) return;
  await createOptimisticUpdate(
    parLevels,
    updates.id,
    updates,
    () =>
      fetch('/api/par-levels', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: updates.id,
          parLevel: updates.par_level,
          reorderPoint: updates.reorder_point,
          unit: updates.unit,
        }),
      }),
    setParLevels,
    () => {
      showSuccess('Par level updated successfully');
      // No refetch needed - optimistic update handles UI
    },
    showError,
  );
}
