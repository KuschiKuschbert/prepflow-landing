import { logger } from '@/lib/logger';

export async function toggleTaskCompletion(
  taskId: string,
  date: string,
  newCompleted: boolean
): Promise<void> {
  const endpoint = newCompleted
    ? `/api/cleaning-tasks/${taskId}/complete`
    : `/api/cleaning-tasks/${taskId}/uncomplete`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completion_date: date }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || data.message || 'Failed to update task');
    }
  } catch (error) {
    logger.error('Error toggling task completion:', error);
    throw error;
  }
}
