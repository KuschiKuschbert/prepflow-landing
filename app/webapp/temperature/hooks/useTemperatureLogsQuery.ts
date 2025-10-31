'use client';

import { useQuery } from '@tanstack/react-query';

interface TemperatureLog {
  id: number;
  log_date: string;
  log_time: string;
  temperature_type: string;
  temperature_celsius: number;
}

export function useTemperatureLogsQuery(
  date: string,
  type: string,
  page: number,
  pageSize: number,
) {
  return useQuery({
    queryKey: ['temperature-logs', { date, type, page, pageSize }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (date) params.append('date', date);
      if (type && type !== 'all') params.append('type', type);
      params.append('page', String(page));
      params.append('pageSize', String(pageSize));
      const res = await fetch(`/api/temperature-logs?${params.toString()}`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch temperature logs');
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'Failed to fetch temperature logs');
      return { items: json.data as TemperatureLog[], total: json.total ?? json.data.length };
    },
    keepPreviousData: true,
    staleTime: 60_000,
  });
}
