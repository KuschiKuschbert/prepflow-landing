'use client';

import type { TaskWithCompletions } from '@/lib/cleaning/completion-logic';
import { useCallback, useEffect, useState } from 'react';
import { toggleTaskCompletion } from '../helpers/toggleTaskCompletion';

interface OptimisticCompletion {
  completed: boolean;
  tempId?: string;
}

interface UseOptimisticCompletionsParams {
  tasks: TaskWithCompletions[];
  dates: string[];
  showSuccess: (msg: string) => void;
  showError: (msg: string) => void;
  onTaskUpdate?: () => void;
}

export function useOptimisticCompletions({
  tasks,
  dates: _dates,
  showSuccess,
  showError,
  onTaskUpdate,
}: UseOptimisticCompletionsParams) {
  const [optimisticCompletions, setOptimisticCompletions] = useState<
    Map<string, OptimisticCompletion>
  >(new Map());

  // Sync optimistic completions with tasks when they update
  useEffect(() => {
    setOptimisticCompletions(prev => {
      const updated = new Map(prev);
      tasks.forEach(task => {
        task.completions.forEach(completion => {
          const key = `${task.id}_${completion.completion_date}`;
          if (updated.has(key)) {
            updated.delete(key);
          }
        });
      });
      return updated;
    });
  }, [tasks]);

  const handleToggleCompletion = useCallback(
    async (taskId: string, date: string, isCompleted: boolean) => {
      const key = `${taskId}_${date}`;
      const newCompleted = !isCompleted;

      const existingOptimistic = optimisticCompletions.get(key);

      // Optimistically update UI
      setOptimisticCompletions(prev => {
        const updated = new Map(prev);
        if (newCompleted) {
          updated.set(key, { completed: true, tempId: `temp-${Date.now()}` });
        } else {
          updated.set(key, { completed: false });
        }
        return updated;
      });

      try {
        await toggleTaskCompletion(taskId, date, newCompleted);

        showSuccess(newCompleted ? 'Task marked as complete' : 'Task marked as incomplete');
        onTaskUpdate?.();
      } catch (error) {
        // Error - revert optimistic update
        setOptimisticCompletions(prev => {
          const updated = new Map(prev);
          updated.delete(key);
          if (existingOptimistic) {
            updated.set(key, existingOptimistic);
          }
          return updated;
        });
        showError(
          newCompleted ? 'Failed to mark task as complete' : 'Failed to mark task as incomplete',
        );
      }
    },
    [showSuccess, showError, onTaskUpdate, optimisticCompletions],
  );

  return { optimisticCompletions, handleToggleCompletion };
}
