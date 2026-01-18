import { logger } from '@/lib/logger';
import { SupabaseClient } from '@supabase/supabase-js';
import { buildParLevelData } from './buildParLevelData';
import { checkIngredientAndDuplicate } from './checkIngredientAndDuplicate';
import { fetchParLevelWithIngredient } from './fetchParLevelWithIngredient';
import { handleInsertError } from './handleInsertError';
import { validateParLevelData } from './validateParLevelData';

import { ApiErrorHandler } from '@/lib/api-error-handler';
import { ParLevelInput } from './types';

/**
 * Create a par level.
 *
 * @param {SupabaseClient} supabase - Supabase client
 * @param {ParLevelInput} parLevelData - Par level data
 * @returns {Promise<Object>} Created par level with ingredient data
 * @throws {Error} If creation fails
 */
export async function createParLevel(supabase: SupabaseClient, parLevelData: ParLevelInput) {


  // Validate required fields
  const { ingredientId } = validateParLevelData(parLevelData);

  // Check if ingredient exists and if par level already exists
  await checkIngredientAndDuplicate(ingredientId);

  const dataToInsert = buildParLevelData(parLevelData);

  // Log the data being inserted for debugging
  logger.dev('[Par Levels API] Inserting par level data:', {
    dataToInsert,
    originalData: parLevelData,
    context: { endpoint: '/api/par-levels', operation: 'POST' },
  });

  // Insert the par level
  const { data: insertedData, error: insertError } = await supabase
    .from('par_levels')
    .insert(dataToInsert)
    .select('id, ingredient_id, par_level, reorder_point, unit, created_at, updated_at')
    .single();

  if (insertError) {
    handleInsertError(insertError, dataToInsert);
  }

  if (!insertedData) {
    throw ApiErrorHandler.createError(
      'Failed to create par level: no data returned',
      'DATABASE_ERROR',
      500,
    );
  }

  // Fetch with ingredient join (with fallback)
  return await fetchParLevelWithIngredient(insertedData.id, insertedData.ingredient_id);
}
