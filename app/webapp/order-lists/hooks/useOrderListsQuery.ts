'use client';

import { useQuery } from '@tanstack/react-query';

interface OrderList {
  id: string;
  supplier_id: string;
  name: string;
  notes?: string;
  status: 'draft' | 'sent' | 'received' | 'cancelled';
  created_at: string;
  updated_at: string;
  suppliers: {
    id: string;
    name: string;
  };
  order_list_items: Array<{
    id: string;
    ingredient_id: string;
    quantity: number;
    unit: string;
    notes?: string;
    ingredients: {
      id: string;
      name: string;
      unit: string;
      category: string;
    };
  }>;
}

interface OrderListsResponse {
  items: OrderList[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export function useOrderListsQuery(page: number, pageSize: number, userId: string) {
  return useQuery<OrderListsResponse, Error>({
    queryKey: ['order-lists', { page, pageSize, userId }],
    queryFn: async () => {
      const res = await fetch(
        `/api/order-lists?userId=${userId}&page=${page}&pageSize=${pageSize}`,
        { cache: 'no-store' },
      );
      if (!res.ok) throw new Error('Failed to fetch order lists');
      const json = await res.json();
      return json.data;
    },
    placeholderData: previousData => previousData,
  });
}
