/**
 * Hook for managing cleaning page data fetching
 */

import { useState, useEffect, useCallback } from 'react';
import { logger } from '@/lib/logger';
import { cacheData, getCachedData, prefetchApis } from '@/lib/cache/data-cache';
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
      setLoading(true);
      const cached = getCachedData<CleaningArea[]>('cleaning_areas');
      if (cached) {
        setAreas(cached);
      }

      const response = await fetch('/api/cleaning-areas');
      if (!response.ok) throw new Error('Failed to fetch areas');

      const data = await response.json();
      if (data.success && data.data) {
        setAreas(data.data);
        cacheData('cleaning_areas', data.data);
      }
    } catch (err) {
      logger.error('[Cleaning Page] Error fetching areas:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const cacheKey = `cleaning_tasks_${startDate.toISOString().split('T')[0]}_${endDate.toISOString().split('T')[0]}`;
      const cached = getCachedData<TaskWithCompletions[]>(cacheKey);
      if (cached) {
        setTasks(cached);
      }

      const response = await fetch(
        `/api/cleaning-tasks?start_date=${startDate.toISOString().split('T')[0]}&end_date=${endDate.toISOString().split('T')[0]}`,
      );
      if (!response.ok) throw new Error('Failed to fetch tasks');

      const data = await response.json();
      if (data.success && data.data) {
        setTasks(data.data.tasks || []);
        cacheData(cacheKey, data.data.tasks || []);
      }
    } catch (err) {
      logger.error('[Cleaning Page] Error fetching tasks:', err);
    } finally {
      setLoading(false);
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
