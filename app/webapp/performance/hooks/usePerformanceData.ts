'use client';

import { cacheData, getCachedData, prefetchApi } from '@/lib/cache/data-cache';
import { supabase } from '@/lib/supabase';
import { useEffect, useRef, useState } from 'react';
import { PerformanceState, DateRange, PerformanceItem } from '../types';
import { exportPerformanceDataToCSV, parseCSVSalesData } from '../utils/csv-utils';
import {
  fetchPerformanceData as fetchPerformanceApi,
  importPerformanceData,
} from '../utils/performance-api';

export function usePerformanceData(dateRange?: DateRange) {
  const cacheKey = dateRange
    ? `performance_data_${dateRange.preset}_${dateRange.startDate?.toISOString()}_${dateRange.endDate?.toISOString()}`
    : 'performance_data';

  const cachedData = getCachedData<Partial<PerformanceState>>(cacheKey);
  // Convert cached lastUpdate string back to Date if needed
  const cachedLastUpdate = cachedData?.lastUpdate
    ? cachedData.lastUpdate instanceof Date
      ? cachedData.lastUpdate
      : new Date(cachedData.lastUpdate)
    : null;

  const [state, setState] = useState<PerformanceState>({
    performanceItems: cachedData?.performanceItems || [],
    metadata: cachedData?.metadata || null,
    performanceAlerts: [],
    performanceScore: cachedData?.performanceScore || 0,
    realtimeEnabled: false,
    lastUpdate: cachedLastUpdate,
    showCharts: false,
    showImportModal: false,
    csvData: '',
    importing: false,
    filters: { profitCategory: [], popularityCategory: [], menuItemClass: [] },
    sortBy: 'name',
    sortOrder: 'asc',
    loading: false,
    error: null,
  });

  const [previousPeriodData, setPreviousPeriodData] = useState<PerformanceItem[] | null>(null);

  const realtimeSubscription = useRef<any>(null);

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
      if (dateRange?.startDate && dateRange?.endDate) {
        const daysDiff = Math.ceil(
          (dateRange.endDate.getTime() - dateRange.startDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        const previousEndDate = new Date(dateRange.startDate);
        previousEndDate.setDate(previousEndDate.getDate() - 1);
        previousEndDate.setHours(23, 59, 59, 999);
        const previousStartDate = new Date(previousEndDate);
        previousStartDate.setDate(previousStartDate.getDate() - daysDiff + 1);
        previousStartDate.setHours(0, 0, 0, 0);

        const previousRange: DateRange = {
          startDate: previousStartDate,
          endDate: previousEndDate,
          preset: 'custom',
        };

        try {
          const previousState = await fetchPerformanceApi(previousRange);
          setPreviousPeriodData(previousState.performanceItems);
        } catch (error) {
          console.warn('Could not fetch previous period data for trends:', error);
          setPreviousPeriodData(null);
        }
      } else {
        setPreviousPeriodData(null);
      }
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

  const setupRealtimeSubscription = () => {
    if (realtimeSubscription.current) realtimeSubscription.current.unsubscribe();
    realtimeSubscription.current = supabase
      .channel('performance-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'sales_data' }, payload => {
        console.log('Performance data updated:', payload);
        fetchPerformanceData();
      })
      .subscribe();
  };

  const handleImport = async () => {
    if (!state.csvData.trim()) return;
    setState(prev => ({ ...prev, importing: true }));
    try {
      const salesData = parseCSVSalesData(state.csvData);
      await importPerformanceData(salesData);
      setState(prev => ({ ...prev, csvData: '', showImportModal: false, importing: false }));
      await fetchPerformanceData();
    } catch (error) {
      console.error('Error importing data:', error);
      setState(prev => ({
        ...prev,
        importing: false,
        performanceAlerts: [
          ...prev.performanceAlerts,
          {
            id: Date.now().toString(),
            message: 'Failed to import sales data',
            timestamp: new Date(),
          },
        ],
      }));
    }
  };

  const handleExportCSV = () => {
    exportPerformanceDataToCSV(state.performanceItems);
  };

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
    setupRealtimeSubscription,
    handleImport,
    handleExportCSV,
    realtimeSubscription,
    previousPeriodData,
  };
}
