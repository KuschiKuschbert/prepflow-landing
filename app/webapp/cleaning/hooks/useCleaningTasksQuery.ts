'use client';

import { useQuery } from '@tanstack/react-query';

interface CleaningTask {
  id: number;
  status: string;
  assigned_date: string;
}

export function useCleaningTasksQuery(page: number, pageSize: number) {
  return useQuery({
    queryKey: ['cleaning-tasks', { page, pageSize }],
    queryFn: async () => {
      const res = await fetch(`/api/cleaning-tasks?page=${page}&pageSize=${pageSize}`, {
        cache: 'no-store',
      });
      if (!res.ok) throw new Error('Failed to fetch cleaning tasks');
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'Failed to fetch cleaning tasks');
      return { items: json.data as CleaningTask[], total: json.total ?? json.data.length };
    },
    placeholderData: previousData => previousData,
    staleTime: 60_000,
  });
}
