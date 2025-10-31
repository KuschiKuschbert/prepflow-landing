'use client';

import { useQuery } from '@tanstack/react-query';

interface OrderList {
  id: string;
  name: string;
  status: string;
  created_at: string;
}

export function useOrderListsQuery(page: number, pageSize: number, userId: string) {
  return useQuery({
    queryKey: ['order-lists', { page, pageSize, userId }],
    queryFn: async () => {
      const res = await fetch(
        `/api/order-lists?userId=${userId}&page=${page}&pageSize=${pageSize}`,
        { cache: 'no-store' },
      );
      if (!res.ok) throw new Error('Failed to fetch order lists');
      const json = await res.json();
      // Expect { success, data, total }
      if (!json.success) throw new Error(json.message || 'Failed to fetch order lists');
      return { items: json.data as OrderList[], total: json.total ?? json.data.length };
    },
    keepPreviousData: true,
    staleTime: 60_000,
  });
}
