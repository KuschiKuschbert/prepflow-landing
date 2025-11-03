'use client';

import { cacheData, getCachedData, prefetchApi } from '@/lib/cache/data-cache';
import { supabase } from '@/lib/supabase';
import { useEffect, useRef, useState } from 'react';
import { PerformanceState } from '../types';
import { exportPerformanceDataToCSV, parseCSVSalesData } from '../utils/csv-utils';
import {
  fetchPerformanceData as fetchPerformanceApi,
  importPerformanceData,
} from '../utils/performance-api';

export function usePerformanceData() {
  const cachedData = getCachedData<Partial<PerformanceState>>('performance_data');
  const [state, setState] = useState<PerformanceState>({
    performanceItems: cachedData?.performanceItems || [],
    metadata: cachedData?.metadata || null,
    performanceAlerts: [],
    performanceScore: cachedData?.performanceScore || 0,
    realtimeEnabled: false,
    lastUpdate: cachedData?.lastUpdate || null,
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

  const realtimeSubscription = useRef<any>(null);

  const fetchPerformanceData = async () => {
    try {
      const newState = await fetchPerformanceApi();
      cacheData('performance_data', newState);
      setState(prev => ({ ...prev, ...newState }));
    } catch (error) {
      console.error('Error fetching performance data:', error);
      setState(prev => ({
        ...prev,
        performanceAlerts: [
          ...prev.performanceAlerts,
          {
            id: Date.now().toString(),
            message: 'Failed to fetch performance data',
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
  }, []);

  return {
    state,
    updateState,
    fetchPerformanceData,
    setupRealtimeSubscription,
    handleImport,
    handleExportCSV,
    realtimeSubscription,
  };
}
