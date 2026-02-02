/**
 * Perform prep list status change operation with optimistic updates.
 */
import { logger } from '@/lib/logger';
import type { PrepList } from '@/lib/types/prep-lists';

interface PerformPrepListStatusChangeParams {
  id: string;
  status: string;
  prepLists: PrepList[];
  setPrepLists: React.Dispatch<React.SetStateAction<PrepList[]>>;
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
}

export async function performPrepListStatusChange({
  id,
  status,
  prepLists,
  setPrepLists,
  showError,
  showSuccess,
}: PerformPrepListStatusChangeParams): Promise<void> {
  const originalPrepLists = [...prepLists];
  const prepListToUpdate = prepLists.find(list => list.id === id);
  if (!prepListToUpdate) {
    showError('Prep list not found');
    return;
  }
  setPrepLists(prevLists =>
    prevLists.map(list =>
      list.id === id ? { ...list, status: status as PrepList['status'] } : list,
    ),
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
    } else {
      setPrepLists(originalPrepLists);
      showError(result.message || 'Failed to update status');
    }
  } catch (err) {
    setPrepLists(originalPrepLists);
    logger.error('Failed to update status:', err);
    showError('Failed to update status. Please check your connection and try again.');
  }
}
