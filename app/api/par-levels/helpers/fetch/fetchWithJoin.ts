import type { SupabaseClient } from '@supabase/supabase-js';
import { logger } from '@/lib/logger';

export async function fetchWithJoin(supabaseAdmin: SupabaseClient) {
  const { data, error } = await supabaseAdmin.from('par_levels').select(
    `
      *,
      ingredients (
        id,
        ingredient_name,
        unit,
        category
      )
    `,
  );

  if (error) {
    logger.error('Failed to fetch par levels with join', { error });
    return { data: null, error };
  }
  return { data, error: null };
}
