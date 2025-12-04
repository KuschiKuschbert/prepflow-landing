/**
 * Performance API utilities
 */

import type { DateRange } from '../types';
import { calculatePerformanceScore } from './calculatePerformanceScore';

import { logger } from '@/lib/logger';
export async function fetchPerformanceData(dateRange?: DateRange, lockedMenuOnly = false) {
  logger.dev('🔄 Fetching performance data from /api/performance...', {
    dateRange,
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

  // API returns { success: true, data: [...], metadata: {...} }
  const performanceItems = data.data || [];
  const result = {
    performanceItems,
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

export async function importPerformanceData(salesData: any[]) {
  const response = await fetch('/api/performance', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ salesData }),
  });
  if (!response.ok) throw new Error('Failed to import sales data');
  return response.json();
}
