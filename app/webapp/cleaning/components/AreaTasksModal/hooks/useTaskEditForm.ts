/**
 * Hook for managing task edit form state
 */

import { useState, useCallback } from 'react';
import type { TaskWithCompletions } from '@/lib/cleaning/completion-logic';

export function useTaskEditForm() {
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({
    task_name: '',
    frequency_type: '',
  });

  const startEdit = useCallback((task: TaskWithCompletions) => {
    setEditingTaskId(task.id);
    setEditFormData({
      task_name: task.task_name || '',
      frequency_type: task.frequency_type || '',
    });
  }, []);

  const cancelEdit = useCallback(() => {
    setEditingTaskId(null);
    setEditFormData({ task_name: '', frequency_type: '' });
  }, []);

  const finishEdit = useCallback(() => {
    setEditingTaskId(null);
  }, []);

  return {
    editingTaskId,
    editFormData,
    setEditFormData,
    startEdit,
    cancelEdit,
    finishEdit,
  };
}




