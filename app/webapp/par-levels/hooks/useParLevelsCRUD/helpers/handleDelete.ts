/**
 * Handle par level delete operation.
 */
import { createOptimisticDelete } from '@/lib/optimistic-updates';
import type { ParLevel } from '../../types';

interface HandleDeleteParams {
  id: string;
  parLevels: ParLevel[];
  setParLevels: React.Dispatch<React.SetStateAction<ParLevel[]>>;
  fetchParLevels: () => Promise<void>;
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
}

export async function handleDelete({
  id,
  parLevels,
  setParLevels,
  fetchParLevels,
  showError,
  showSuccess,
}: HandleDeleteParams): Promise<void> {
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
}
