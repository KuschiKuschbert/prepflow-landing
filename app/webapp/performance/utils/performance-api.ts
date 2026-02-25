/**
 * Performance API utilities
 */

import type { DateRange } from '@/lib/types/performance';
import { calculatePerformanceScore } from './calculatePerformanceScore';
import type { SalesData } from './csv-utils/helpers/mapCSVRowToSalesData';

import { logger } from '@/lib/logger';
export interface PerformanceFetchOptions {
  menuId?: string | null;
  lockedMenuOnly?: boolean;
}

export async function fetchPerformanceData(
  dateRange?: DateRange,
  options: PerformanceFetchOptions = {},
) {
  const { menuId, lockedMenuOnly = false } = options;
  logger.dev('🔄 Fetching performance data from /api/performance...', {
    dateRange,
    menuId,
    lockedMenuOnly,
  });

  // Build query string with date range parameters and menu filter
  const params = new URLSearchParams();
  if (dateRange?.startDate) {
    params.append('startDate', dateRange.startDate.toISOString().split('T')[0]);
  }
  if (dateRange?.endDate) {
    params.append('endDate', dateRange.endDate.toISOString().split('T')[0]);
  }
  if (menuId) {
    params.append('menuId', menuId);
  }
  if (lockedMenuOnly) {
    params.append('lockedMenuOnly', 'true');
  }

  const queryString = params.toString();
  const url = queryString ? `/api/performance?${queryString}` : '/api/performance';

  const response = await fetch(url);
  logger.dev('📡 Performance API response status:', response.status);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    logger.error('❌ Performance API error:', errorData);
    throw new Error(errorData.message || errorData.error || 'Failed to fetch performance data');
  }

  const data = await response.json();
  logger.dev('✅ Performance API response:', {
    success: data.success,
    itemsCount: data.data?.length || 0,
    hasMetadata: !!data.metadata,
  });

  // API returns { success, data, performanceHistory, weatherByDate, metadata }
  const performanceItems = data.data || [];
  const result = {
    performanceItems,
    performanceHistory: data.performanceHistory || [],
    weatherByDate: data.weatherByDate || {},
    metadata: data.metadata || null,
    performanceAlerts: [],
    performanceScore: calculatePerformanceScore(performanceItems),
  };

  logger.dev('📊 Returning performance data:', {
    itemsCount: result.performanceItems.length,
    hasMetadata: !!result.metadata,
  });

  return result;
}

export async function importPerformanceData(salesData: SalesData[]) {
  const response = await fetch('/api/performance', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ salesData }),
  });
  if (!response.ok) throw new Error('Failed to import sales data');
  return response.json();
}
