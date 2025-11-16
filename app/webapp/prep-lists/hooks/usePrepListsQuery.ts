'use client';

import { useQuery } from '@tanstack/react-query';

interface KitchenSection {
  id: string;
  name: string;
  color: string;
}

interface Ingredient {
  id: string;
  name: string;
  unit: string;
  category: string;
}

interface PrepListItem {
  id: string;
  ingredient_id: string;
  quantity: number;
  unit: string;
  notes?: string;
  ingredients: Ingredient;
}

interface PrepList {
  id: string;
  kitchen_section_id: string;
  name: string;
  notes?: string;
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
  kitchen_sections: KitchenSection;
  prep_list_items: PrepListItem[];
}

interface PrepListsResponse {
  items: PrepList[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export function usePrepListsQuery(page: number, pageSize: number, userId: string) {
  return useQuery<PrepListsResponse, Error>({
    queryKey: ['prep-lists', { page, pageSize, userId }],
    queryFn: async () => {
      const res = await fetch(
        `/api/prep-lists?userId=${userId}&page=${page}&pageSize=${pageSize}`,
        { cache: 'no-store' },
      );
      if (!res.ok) throw new Error('Failed to fetch prep lists');
      const json = await res.json();
      return json.data;
    },
    placeholderData: previousData => previousData,
    staleTime: 30000, // Consider data fresh for 30 seconds
  });
}
