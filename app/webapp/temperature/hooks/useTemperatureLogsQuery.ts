'use client';

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
      return json.data;
    },
    placeholderData: previousData => previousData,
  });
}
