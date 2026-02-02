/**
 * Perform prep list delete operation with optimistic updates.
 */
import { logger } from '@/lib/logger';
import type { PrepList } from '@/lib/types/prep-lists';

interface PerformPrepListDeleteParams {
  id: string;
  prepLists: PrepList[];
  setPrepLists: React.Dispatch<React.SetStateAction<PrepList[]>>;
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
}

export async function performPrepListDelete({
  id,
  prepLists,
  setPrepLists,
  showError,
  showSuccess,
}: PerformPrepListDeleteParams): Promise<void> {
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
    } else {
      setPrepLists(originalPrepLists);
      showError(result.message || 'Failed to delete prep list');
    }
  } catch (err) {
    setPrepLists(originalPrepLists);
    logger.error('Failed to delete prep list:', err);
    showError('Failed to delete prep list. Please check your connection and try again.');
  }
}
