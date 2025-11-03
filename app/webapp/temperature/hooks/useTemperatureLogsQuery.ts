'use client';

import { cacheData, getCachedData, prefetchApi } from '@/lib/cache/data-cache';
import { useQuery } from '@tanstack/react-query';
import { TemperatureLog } from '../types';

interface TemperatureLogsResponse {
  items: TemperatureLog[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export function useTemperatureLogsQuery(
  date: string,
  type: string,
  page: number,
  pageSize: number,
) {
  // Prefetch first page with default filters
  if (page === 1 && !date && type === 'all') {
    prefetchApi('/api/temperature-logs?page=1&pageSize=20');
  }

  const cacheKey = `temperature_logs_${date}_${type}_${page}`;

  return useQuery<TemperatureLogsResponse, Error>({
    queryKey: ['temperature-logs', { date, type, page, pageSize }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (date) params.append('date', date);
      if (type !== 'all') params.append('type', type);
      params.append('page', page.toString());
      params.append('pageSize', pageSize.toString());

      const res = await fetch(`/api/temperature-logs?${params.toString()}`, {
        cache: 'no-store',
      });
      if (!res.ok) throw new Error('Failed to fetch temperature logs');
      const json = await res.json();
      const data = json.data;
      // Cache first page for instant display
      if (page === 1 && data?.items) {
        cacheData(cacheKey, data.items);
      }
      return data;
    },
    placeholderData: previousData => previousData,
    // Use cached data as initial data if available
    initialData:
      page === 1
        ? (() => {
            const cached = getCachedData<TemperatureLog[]>(cacheKey);
            if (cached) {
              return {
                items: cached,
                total: cached.length,
                page: 1,
                pageSize,
                totalPages: 1,
              } as TemperatureLogsResponse;
            }
            return undefined;
          })()
        : undefined,
  });
}
