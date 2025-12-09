/**
 * Fetch functions for cleaning page data
 */

import { logger } from '@/lib/logger';
import { cacheData, getCachedData } from '@/lib/cache/data-cache';
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

/**
 * Fetch cleaning areas with caching
 *
 * @param {Function} setAreas - Set areas state
 * @param {Function} setLoading - Set loading state
 * @returns {Promise<void>}
 */
export async function fetchCleaningAreas(
  setAreas: (areas: CleaningArea[]) => void,
  setLoading: (loading: boolean) => void,
): Promise<void> {
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
}

/**
 * Fetch cleaning tasks with caching
 *
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Function} setTasks - Set tasks state
 * @param {Function} setLoading - Set loading state
 * @returns {Promise<void>}
 */
export async function fetchCleaningTasks(
  startDate: Date,
  endDate: Date,
  setTasks: (tasks: TaskWithCompletions[]) => void,
  setLoading: (loading: boolean) => void,
): Promise<void> {
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
}
