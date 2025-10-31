'use client';

import { useQuery } from '@tanstack/react-query';

interface PrepList {
  id: string;
  name: string;
  status: string;
  created_at: string;
}

export function usePrepListsQuery(page: number, pageSize: number, userId: string) {
  return useQuery({
    queryKey: ['prep-lists', { page, pageSize, userId }],
    queryFn: async () => {
      const res = await fetch(
        `/api/prep-lists?userId=${userId}&page=${page}&pageSize=${pageSize}`,
        { cache: 'no-store' },
      );
      if (!res.ok) throw new Error('Failed to fetch prep lists');
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'Failed to fetch prep lists');
      return { items: json.data as PrepList[], total: json.total ?? json.data.length };
    },
    keepPreviousData: true,
    staleTime: 60_000,
  });
}
