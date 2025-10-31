'use client';

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

interface Ingredient {
  id: string;
  ingredient_name: string;
  brand?: string;
  supplier?: string;
  unit?: string;
  cost_per_unit?: number;
  storage_location?: string;
  category?: string;
}

export function useIngredientsQuery(page: number, pageSize: number) {
  return useQuery({
    queryKey: ['ingredients', { page, pageSize }],
    queryFn: async () => {
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      const { data, error, count } = await supabase
        .from('ingredients')
        .select('*', { count: 'exact' })
        .order('ingredient_name', { ascending: true })
        .range(from, to);
      if (error) throw error;
      return { items: (data || []) as Ingredient[], total: count || 0 };
    },
    staleTime: 1000 * 60,
    keepPreviousData: true,
  });
}
