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

export interface IngredientsQueryParams {
  page: number;
  pageSize: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  category?: string;
  supplier?: string;
  storage?: string;
}

export function useIngredientsQuery(params: IngredientsQueryParams) {
  const { page, pageSize, search, sortBy, sortOrder, category, supplier, storage } = params;

  // Construct query string
  const queryString = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
    ...(search && { search }),
    ...(sortBy && { sortBy }),
    ...(sortOrder && { sortOrder }),
    ...(category && { category }),
    ...(supplier && { supplier }),
    ...(storage && { storage }),
  }).toString();

  // Prefetch on first page (only if no filters active to avoid cache thrashing)
  if (page === 1 && !search && !category && !supplier && !storage) {
    prefetchApi(`/api/ingredients?${queryString}`);
  }

  return useQuery<IngredientsResponse, Error>({
    queryKey: ['ingredients', params],
    queryFn: async () => {
      const res = await fetch(`/api/ingredients?${queryString}`, {
        cache: 'no-store',
      });
      if (!res.ok) throw new Error('Failed to fetch ingredients');
      const json = (await res.json()) as { data: IngredientsResponse };
      const data = json.data;

      // Cache first page for instant display (only default view)
      if (page === 1 && !search && !category && !supplier && !storage && data?.items) {
        cacheData('ingredients_page_1', data.items);
      }
      return data;
    },
    // Use cached data as initial data only for default view
    initialData:
      page === 1 && !search && !category && !supplier && !storage
        ? (() => {
            const cached = getCachedData<Ingredient[]>('ingredients_page_1');
            if (cached) {
              return {
                items: cached,
                total: cached.length, // Approximate total from cache
                page: 1,
                pageSize,
                totalPages: 1, // Unknown real total
              } as IngredientsResponse;
            }
            return undefined;
          })()
        : undefined,
  });
}
