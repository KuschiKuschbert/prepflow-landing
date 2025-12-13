/**
 * Hook for fetching tasks for a specific area
 */

import { useState, useEffect, useCallback } from 'react';
import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';
import type { TaskWithCompletions } from '@/lib/cleaning/completion-logic';

export function useAreaTasks(areaId: string | undefined, isOpen: boolean) {
  const { showError } = useNotification();
  const [tasks, setTasks] = useState<TaskWithCompletions[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTasks = useCallback(async () => {
    if (!areaId) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/cleaning-tasks?area_id=${areaId}`);
      const data = await response.json();

      if (data.success && data.data) {
        setTasks(data.data);
      } else {
        showError('Failed to load tasks');
      }
    } catch (error) {
      logger.error('Error fetching area tasks:', error);
      showError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [areaId, showError]);

  useEffect(() => {
    if (isOpen && areaId) {
      fetchTasks();
    } else {
      setTasks([]);
    }
  }, [isOpen, areaId, fetchTasks]);

  return { tasks, setTasks, loading, refetch: fetchTasks };
}
