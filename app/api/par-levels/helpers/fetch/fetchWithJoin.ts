import type { SupabaseClient } from '@supabase/supabase-js';

export async function fetchWithJoin(supabaseAdmin: SupabaseClient) {
  return await supabaseAdmin.from('par_levels').select(
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
}
