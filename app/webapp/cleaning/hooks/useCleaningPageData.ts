/**
 * Hook for managing cleaning page data fetching
 */

import { useState, useEffect, useCallback } from 'react';
import { prefetchApis } from '@/lib/cache/data-cache';
import { logger } from '@/lib/logger';
import type { TaskWithCompletions } from '@/lib/cleaning/completion-logic';
import { fetchCleaningAreas, fetchCleaningTasks } from './useCleaningPageData/fetchFunctions';

interface CleaningArea {
  id: string;
  area_name: string;
  description?: string;
  cleaning_frequency?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function useCleaningPageData(startDate: Date, endDate: Date, activeTab: 'grid' | 'areas') {
  const [areas, setAreas] = useState<CleaningArea[]>([]);
  const [tasks, setTasks] = useState<TaskWithCompletions[]>([]);
  const [loading, setLoading] = useState(false);

  // Prefetch APIs on mount
  useEffect(() => {
    prefetchApis([
      '/api/cleaning-areas',
      `/api/cleaning-tasks?start_date=${startDate.toISOString().split('T')[0]}&end_date=${endDate.toISOString().split('T')[0]}`,
    ]);
  }, [startDate, endDate]);

  const fetchAreas = useCallback(async () => {
    try {
      await fetchCleaningAreas(setAreas, setLoading);
    } catch (error) {
      logger.error('[useCleaningPageData] Error fetching areas:', {
        error: error instanceof Error ? error.message : String(error),
      });
      // Error is handled by fetchCleaningAreas via setLoading
    }
  }, []);

  const fetchTasks = useCallback(async () => {
    try {
      await fetchCleaningTasks(startDate, endDate, setTasks, setLoading);
    } catch (error) {
      logger.error('[useCleaningPageData] Error fetching tasks:', {
        error: error instanceof Error ? error.message : String(error),
        startDate,
        endDate,
      });
      // Error is handled by fetchCleaningTasks via setLoading
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchAreas();
  }, [fetchAreas]);

  useEffect(() => {
    if (activeTab === 'grid') {
      fetchTasks();
    } else {
      // Delay task fetch for areas tab to improve perceived performance
      const timeoutId = setTimeout(() => {
        fetchTasks();
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [activeTab, fetchTasks]);

  return {
    areas,
    setAreas,
    tasks,
    setTasks,
    loading,
    refetchAreas: fetchAreas,
    refetchTasks: fetchTasks,
  };
}
