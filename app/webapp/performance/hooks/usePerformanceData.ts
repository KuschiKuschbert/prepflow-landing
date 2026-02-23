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
export function usePerformanceData(dateRange?: DateRange) {
  const cacheKey = dateRange
    ? `performance_data_${dateRange.preset}_${dateRange.startDate?.toISOString()}_${dateRange.endDate?.toISOString()}`
    : 'performance_data';

  const [state, setState] = useState<PerformanceState>(usePerformanceState(dateRange));
  const { previousPeriodData, fetchPreviousPeriodData } = usePreviousPeriodData();
  const onPerformanceAnalyzed = useOnPerformanceAnalyzed();

  const fetchPerformanceData = async () => {
    logger.dev('🔄 usePerformanceData: Starting fetch...', { dateRange });
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Fetch main performance data and previous period data in parallel
      const [newState] = await Promise.all([
        fetchPerformanceApi(dateRange),
        fetchPreviousPeriodData(dateRange),
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
  }, [dateRange?.preset, dateRange?.startDate?.toISOString(), dateRange?.endDate?.toISOString()]);

  return {
    state,
    updateState,
    fetchPerformanceData,
    handleImport,
    handleExportCSV,
    previousPeriodData,
  };
}
