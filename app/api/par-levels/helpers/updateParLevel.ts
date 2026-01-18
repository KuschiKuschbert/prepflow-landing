import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { SupabaseClient } from '@supabase/supabase-js';
import { buildParLevelData } from './buildParLevelData';
import { ParLevelInput } from './types';

/**
 * Update a par level.
 *
 * @param {SupabaseClient} supabase - Supabase client
 * @param {string} id - Par level ID
 * @param {Object} updates - Update data
 * @returns {Promise<Object>} Updated par level with ingredient data
 * @throws {Error} If update fails
 */
export async function updateParLevel(supabase: SupabaseClient, id: string, updates: unknown) {


  // Check if par level exists
  const { data: existing, error: checkError } = await supabase
    .from('par_levels')
    .select('id')
    .eq('id', id)
    .single();

  if (checkError || !existing) {
    throw ApiErrorHandler.createError('Par level not found', 'NOT_FOUND', 404);
  }

  const updateData = buildParLevelData(updates as ParLevelInput);

  // Remove null/undefined values
  Object.keys(updateData).forEach(key => {
    if (
      updateData[key as keyof typeof updateData] === null ||
      updateData[key as keyof typeof updateData] === undefined
    ) {
      delete updateData[key as keyof typeof updateData];
    }
  });

  const { data, error } = await supabase
    .from('par_levels')
    .update(updateData)
    .eq('id', id)
    .select(
      `
      *,
      ingredients (
        id,
        ingredient_name,
        unit,
        category
      )
    `,
    )
    .single();

  if (error) {
    logger.error('[Par Levels API] Database error updating par level:', {
      error: error.message,
      code: error.code,
      context: { endpoint: '/api/par-levels', operation: 'PUT', parLevelId: id },
    });
    throw ApiErrorHandler.fromSupabaseError(error, 500);
  }

  return data;
}
