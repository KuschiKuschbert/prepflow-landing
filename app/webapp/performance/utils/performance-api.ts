/**
 * Performance API utilities
 */

import { DateRange } from '../types';

export async function fetchPerformanceData(dateRange?: DateRange) {
  console.log('🔄 Fetching performance data from /api/performance...', { dateRange });

  // Build query string with date range parameters
  const params = new URLSearchParams();
  if (dateRange?.startDate) {
    params.append('startDate', dateRange.startDate.toISOString().split('T')[0]);
  }
  if (dateRange?.endDate) {
    params.append('endDate', dateRange.endDate.toISOString().split('T')[0]);
  }

  const queryString = params.toString();
  const url = queryString ? `/api/performance?${queryString}` : '/api/performance';

  const response = await fetch(url);
  console.log('📡 Performance API response status:', response.status);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('❌ Performance API error:', errorData);
    throw new Error(errorData.message || errorData.error || 'Failed to fetch performance data');
  }

  const data = await response.json();
  console.log('✅ Performance API response:', {
    success: data.success,
    itemsCount: data.data?.length || 0,
    hasMetadata: !!data.metadata,
  });

  // API returns { success: true, data: [...], metadata: {...} }
  const result = {
    performanceItems: data.data || [],
    metadata: data.metadata || null,
    performanceAlerts: [],
    performanceScore: 0,
    lastUpdate: new Date(),
  };

  console.log('📊 Returning performance data:', {
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
