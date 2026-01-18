/**
 * Hook for managing cleaning page event handlers
 */

import { useCallback, useMemo } from 'react';
import type { TaskWithCompletions } from '@/lib/cleaning/completion-logic';

interface CleaningArea {
  id: string;
  area_name: string;
  description?: string;
  cleaning_frequency?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface UseCleaningHandlersProps {
  areas: CleaningArea[];
  tasks: TaskWithCompletions[];
  activeTab: 'grid' | 'areas';
  onCreateTask: () => void;
}

export function useCleaningHandlers({
  areas,
  tasks,
  activeTab: _activeTab,
  onCreateTask,
}: UseCleaningHandlersProps) {
  // Memoize area tasks lookup to avoid recalculating on every render
  const areaTasksMap = useMemo(() => {
    const map = new Map<string, TaskWithCompletions[]>();
    tasks.forEach(task => {
      if (!task.area_id) return; // Skip tasks without area_id
      const existing = map.get(task.area_id) || [];
      map.set(task.area_id, [...existing, task]);
    });
    return map;
  }, [tasks]);

  const handleViewTasks = useCallback(
    (areaId: string, onOpenModal: (area: CleaningArea) => void) => {
      const areaToShow = areas.find(a => a.id === areaId);
      if (!areaToShow) return;

      // Use memoized map instead of filtering
      const areaTasks = areaTasksMap.get(areaId) || [];

      if (areaTasks.length === 0) {
        // No tasks - directly open create task form instead of modal
        onCreateTask();
      } else {
        // Has tasks - open modal to view them
        onOpenModal(areaToShow);
      }
    },
    [areas, areaTasksMap, onCreateTask],
  );

  const handleTaskCreated = useCallback(() => {
    // Optimistic updates handle UI updates, no refetch needed
  }, []);

  const handleTaskUpdate = useCallback(() => {
    // Optimistic updates handle UI updates, no refetch needed
  }, []);

  return {
    areaTasksMap,
    handleViewTasks,
    handleTaskCreated,
    handleTaskUpdate,
  };
}
