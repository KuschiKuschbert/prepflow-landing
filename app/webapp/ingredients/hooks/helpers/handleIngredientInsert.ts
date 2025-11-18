import { supabase } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import { PostgrestError } from '@supabase/supabase-js';

interface ApiError {
  message: string;
  isApiError: true;
}

type InsertError = PostgrestError | ApiError;

/**
 * Insert ingredient via Supabase with fallback to API route.
 *
 * @param {any} normalized - Normalized ingredient data
 * @param {any} originalIngredientData - Original ingredient data for API fallback
 * @returns {Promise<{data: any, error: InsertError | null}>} Insert result
 */
export async function handleIngredientInsert(
  normalized: any,
  originalIngredientData: any,
): Promise<{ data: any; error: InsertError | null }> {
  const { data, error } = await supabase.from('ingredients').insert([normalized]).select();

  if (error) {
    if (error.code === '42501' || error.message?.includes('row-level security')) {
      logger.warn('RLS policy blocked direct insert, falling back to API route');
      const response = await fetch('/api/ingredients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(originalIngredientData),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        return {
          data: null,
          error: {
            message: result.details || result.error || 'Failed to add ingredient',
            isApiError: true as const,
          },
        };
      }

      return { data: result.data, error: null };
    }

    return { data: null, error };
  }

  return { data: data && data.length > 0 ? data[0] : null, error: null };
}
