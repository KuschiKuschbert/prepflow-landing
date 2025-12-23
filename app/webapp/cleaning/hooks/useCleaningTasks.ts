'use client';

import { useCallback } from 'react';
import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';
import { createOptimisticUpdate } from '@/lib/optimistic-updates/update';
import { createOptimisticDelete } from '@/lib/optimistic-updates/delete';
import type { TaskWithCompletions } from '@/lib/cleaning/completion-logic';

interface UseCleaningTasksProps {
  tasks: TaskWithCompletions[];
  setTasks: React.Dispatch<React.SetStateAction<TaskWithCompletions[]>>;
  onTaskUpdate?: () => void;
}

/**
 * Hook for managing cleaning tasks CRUD operations with optimistic updates
 */
export function useCleaningTasks({ tasks, setTasks, onTaskUpdate }: UseCleaningTasksProps) {
  const { showSuccess, showError } = useNotification();

  const handleUpdateTask = useCallback(
    async (taskId: string, updates: { task_name: string; frequency_type: string }) => {
      try {
        await createOptimisticUpdate(
          tasks,
          taskId,
          {
            task_name: updates.task_name,
            frequency_type: updates.frequency_type,
          } as Partial<TaskWithCompletions>,
          () =>
            fetch(`/api/cleaning-tasks`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                id: taskId,
                task_name: updates.task_name,
                frequency_type: updates.frequency_type,
              }),
            }),
          setTasks,
          () => {
            showSuccess('Task updated successfully');
            onTaskUpdate?.();
          },
          error => {
            showError(error || 'Failed to update task');
          },
        );
      } catch (error) {
        logger.error('[useCleaningTasks] Error updating task:', {
          error: error instanceof Error ? error.message : String(error),
          taskId,
        });
        showError('Failed to update task');
      }
    },
    [tasks, setTasks, showSuccess, showError, onTaskUpdate],
  );

  const handleDeleteTask = useCallback(
    async (taskId: string) => {
      try {
        await createOptimisticDelete(
          tasks,
          taskId,
          () => fetch(`/api/cleaning-tasks?id=${taskId}`, { method: 'DELETE' }),
          setTasks,
          () => {
            showSuccess('Task deleted successfully');
            // Don't call onTaskUpdate here - optimistic update already removed task from UI
            // Refetching could cause race condition or bring task back if server hasn't processed yet
          },
          error => {
            showError(error || 'Failed to delete task');
          },
        );
      } catch (error) {
        logger.error('[useCleaningTasks] Error deleting task:', {
          error: error instanceof Error ? error.message : String(error),
          taskId,
        });
        showError('Failed to delete task');
      }
    },
    [tasks, setTasks, showSuccess, showError],
  );

  return {
    handleUpdateTask,
    handleDeleteTask,
  };
}
