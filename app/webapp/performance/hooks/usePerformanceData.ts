'use client';

import { cacheData, prefetchApi } from '@/lib/cache/data-cache';
import { useEffect, useState } from 'react';
import type { DateRange, PerformanceState } from '@/lib/types/performance';
import { fetchPerformanceData as fetchPerformanceApi } from '../utils/performance-api';
import { usePerformanceImportExport } from './usePerformanceImportExport';
import { usePerformanceState } from './usePerformanceState';
import { usePreviousPeriodData } from './usePreviousPeriodData';
import { useOnPerformanceAnalyzed } from '@/lib/personality/hooks';

import { logger } from '@/lib/logger';

export interface UsePerformanceDataOptions {
  menuId?: string | null;
  lockedMenuOnly?: boolean;
}

export function usePerformanceData(dateRange?: DateRange, options: UsePerformanceDataOptions = {}) {
  const { menuId, lockedMenuOnly = false } = options;
  const cacheKey = dateRange
    ? `performance_data_${dateRange.preset}_${dateRange.startDate?.toISOString()}_${dateRange.endDate?.toISOString()}_menu_${menuId ?? 'all'}_locked_${lockedMenuOnly}`
    : 'performance_data';

  const [state, setState] = useState<PerformanceState>(usePerformanceState(dateRange));
  const { previousPeriodData, fetchPreviousPeriodData } = usePreviousPeriodData();
  const onPerformanceAnalyzed = useOnPerformanceAnalyzed();

  const fetchPerformanceData = async () => {
    logger.dev('🔄 usePerformanceData: Starting fetch...', { dateRange, menuId, lockedMenuOnly });
    setState(prev => ({ ...prev, loading: true, error: null }));

    const fetchOptions = { menuId, lockedMenuOnly };

    try {
      // Fetch main performance data and previous period data in parallel
      const [newState] = await Promise.all([
        fetchPerformanceApi(dateRange, fetchOptions),
        fetchPreviousPeriodData(dateRange, fetchOptions),
      ]);
      logger.dev('✅ usePerformanceData: Received data:', {
        itemsCount: newState.performanceItems.length,
        hasMetadata: !!newState.metadata,
      });

      cacheData(cacheKey, newState);
      setState(prev => ({ ...prev, ...newState, loading: false }));

      // Trigger personality hook when performance analysis completes
      if (newState.performanceItems.length > 0) {
        onPerformanceAnalyzed();
      }
    } catch (error) {
      logger.error('❌ usePerformanceData: Error fetching performance data:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
        performanceAlerts: [
          ...prev.performanceAlerts,
          {
            id: Date.now().toString(),
            message: `Failed to fetch performance data: ${errorMessage}`,
            timestamp: new Date(),
          },
        ],
      }));
    }
  };

  const { handleImport, handleExportCSV } = usePerformanceImportExport({
    state,
    setState,
    fetchPerformanceData,
  });

  const updateState = (updates: Partial<PerformanceState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  useEffect(() => {
    // Prefetch performance API
    prefetchApi('/api/performance');
    fetchPerformanceData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dateRange?.preset,
    dateRange?.startDate?.toISOString(),
    dateRange?.endDate?.toISOString(),
    menuId,
    lockedMenuOnly,
  ]);

  return {
    state,
    updateState,
    fetchPerformanceData,
    handleImport,
    handleExportCSV,
    previousPeriodData,
  };
}
