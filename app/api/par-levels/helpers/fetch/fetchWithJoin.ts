import { logger } from '@/lib/logger';
import type { SupabaseClient } from '@supabase/supabase-js';

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
    logger.error('[Par Levels] fetchWithJoin failed:', { error: error.message, code: error.code });
    return { data: null, error };
  }
  return { data, error };
}
