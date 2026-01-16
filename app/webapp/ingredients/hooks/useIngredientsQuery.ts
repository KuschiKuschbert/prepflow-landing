'use client';

import { cacheData, getCachedData, prefetchApi } from '@/lib/cache/data-cache';
import { useQuery } from '@tanstack/react-query';

interface Ingredient {
  id: string;
  ingredient_name: string;
  brand?: string;
  pack_size?: string;
  pack_size_unit?: string;
  pack_price?: number;
  category?: string;
  unit?: string;
  cost_per_unit: number;
  cost_per_unit_as_purchased?: number;
  cost_per_unit_incl_trim?: number;
  trim_peel_waste_percentage?: number;
  yield_percentage?: number;
  supplier?: string;
  product_code?: string;
  storage_location?: string;
  min_stock_level?: number;
  current_stock?: number;
  created_at?: string;
  updated_at?: string;
}

interface IngredientsResponse {
  items: Ingredient[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export function useIngredientsQuery(page: number, pageSize: number) {
  // Prefetch on first page
  if (page === 1) {
    prefetchApi('/api/ingredients?page=1&pageSize=20');
  }

  return useQuery<IngredientsResponse, Error>({
    queryKey: ['ingredients', { page, pageSize }],
    queryFn: async () => {
      const res = await fetch(`/api/ingredients?page=${page}&pageSize=${pageSize}`, {
        cache: 'no-store',
      });
      if (!res.ok) throw new Error('Failed to fetch ingredients');
      const json = (await res.json()) as { data: IngredientsResponse };
      const data = json.data;
      // Cache first page for instant display
      if (page === 1 && data?.items) {
        cacheData('ingredients_page_1', data.items);
      }
      return data;
    },
    placeholderData: previousData => previousData,
    // Use cached data as initial data if available
    initialData:
      page === 1
        ? (() => {
            const cached = getCachedData<Ingredient[]>('ingredients_page_1');
            if (cached) {
              return {
                items: cached,
                total: cached.length,
                page: 1,
                pageSize,
                totalPages: 1,
              } as IngredientsResponse;
            }
            return undefined;
          })()
        : undefined,
  });
}
