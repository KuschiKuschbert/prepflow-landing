'use client';

import { getCachedData } from '@/lib/cache/data-cache';
import { DateRange, PerformanceState } from '../types';

export function usePerformanceState(dateRange?: DateRange): PerformanceState {
  const cacheKey = dateRange
    ? `performance_data_${dateRange.preset}_${dateRange.startDate?.toISOString()}_${dateRange.endDate?.toISOString()}`
    : 'performance_data';

  const cachedData = getCachedData<Partial<PerformanceState>>(cacheKey);

  return {
    performanceItems: cachedData?.performanceItems || [],
    performanceHistory: cachedData?.performanceHistory || [],
    metadata: cachedData?.metadata || null,
    performanceAlerts: [],
    performanceScore: cachedData?.performanceScore || 0,
    showCharts: false,
    showImportModal: false,
    csvData: '',
    importing: false,
    filters: { profitCategory: [], popularityCategory: [], menuItemClass: [] },
    sortBy: 'name',
    sortOrder: 'asc',
    loading: false,
    error: null,
  };
}
