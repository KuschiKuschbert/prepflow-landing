/**
 * Hook for managing modal state on cleaning page
 */

import { useState, useCallback } from 'react';

interface CleaningArea {
  id: string;
  area_name: string;
  description?: string;
  cleaning_frequency?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function useCleaningModals() {
  const [showAddArea, setShowAddArea] = useState(false);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [showAreaTasks, setShowAreaTasks] = useState(false);
  const [selectedArea, setSelectedArea] = useState<CleaningArea | null>(null);
  const [preselectedAreaId, setPreselectedAreaId] = useState<string | undefined>();

  const openCreateTask = useCallback((areaId?: string) => {
    setPreselectedAreaId(areaId);
    setShowCreateTask(true);
  }, []);

  const closeCreateTask = useCallback(() => {
    setShowCreateTask(false);
    setPreselectedAreaId(undefined);
  }, []);

  const openAreaTasks = useCallback((area: CleaningArea) => {
    setSelectedArea(area);
    setShowAreaTasks(true);
  }, []);

  const closeAreaTasks = useCallback(() => {
    setShowAreaTasks(false);
    setSelectedArea(null);
  }, []);

  return {
    showAddArea,
    setShowAddArea,
    showCreateTask,
    setShowCreateTask: openCreateTask,
    closeCreateTask,
    showAreaTasks,
    setShowAreaTasks: openAreaTasks,
    closeAreaTasks,
    selectedArea,
    preselectedAreaId,
  };
}




