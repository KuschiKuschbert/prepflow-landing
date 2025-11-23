'use client';

import { useCallback } from 'react';
import { useNotification } from '@/contexts/NotificationContext';
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
    },
    [tasks, setTasks, showSuccess, showError, onTaskUpdate],
  );

  const handleDeleteTask = useCallback(
    async (taskId: string) => {
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
    },
    [tasks, setTasks, showSuccess, showError],
  );

  return {
    handleUpdateTask,
    handleDeleteTask,
  };
}
