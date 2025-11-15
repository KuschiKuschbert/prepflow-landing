'use client';

import { cacheData, prefetchApi } from '@/lib/cache/data-cache';
import { useEffect, useState } from 'react';
import { DateRange, PerformanceState } from '../types';
import { fetchPerformanceData as fetchPerformanceApi } from '../utils/performance-api';
import { usePerformanceImportExport } from './usePerformanceImportExport';
import { usePerformanceState } from './usePerformanceState';
import { usePreviousPeriodData } from './usePreviousPeriodData';

export function usePerformanceData(dateRange?: DateRange) {
  const cacheKey = dateRange
    ? `performance_data_${dateRange.preset}_${dateRange.startDate?.toISOString()}_${dateRange.endDate?.toISOString()}`
    : 'performance_data';

  const [state, setState] = useState<PerformanceState>(usePerformanceState(dateRange));
  const { previousPeriodData, fetchPreviousPeriodData } = usePreviousPeriodData();

  const fetchPerformanceData = async () => {
    console.log('🔄 usePerformanceData: Starting fetch...', { dateRange });
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const newState = await fetchPerformanceApi(dateRange);
      console.log('✅ usePerformanceData: Received data:', {
        itemsCount: newState.performanceItems.length,
        hasMetadata: !!newState.metadata,
      });

      cacheData(cacheKey, newState);
      setState(prev => ({ ...prev, ...newState, loading: false }));

      // Fetch previous period data for trend comparison
      await fetchPreviousPeriodData(dateRange);
    } catch (error) {
      console.error('❌ usePerformanceData: Error fetching performance data:', error);
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
