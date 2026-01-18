import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { PostgrestError } from '@supabase/supabase-js';
import { CreatePrepListParams, PrepList } from '../types';

export async function createPrepList(params: CreatePrepListParams) {
  if (!supabaseAdmin) {
    throw ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500);
  }

  const { userId, kitchenSectionId, name, notes, items } = params;

  // Create the prep list
  const { data: prepList, error: prepError } = await supabaseAdmin
    .from('prep_lists')
    .insert({
      user_id: userId,
      kitchen_section_id: kitchenSectionId,
      name: name,
      notes: notes,
      status: 'draft',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (prepError) {
    const pgError = prepError as PostgrestError;
    logger.error('[Prep Lists API] Database error creating prep list:', {
      error: pgError.message,
      code: pgError.code,
      context: { endpoint: '/api/prep-lists', operation: 'POST', table: 'prep_lists' },
    });
    throw ApiErrorHandler.fromSupabaseError(pgError, 500);
  }

  const createdList = prepList as PrepList;

  // Add items if provided
  if (items && items.length > 0) {
    const prepItems = items.map((item) => ({
      prep_list_id: createdList.id,
      ingredient_id: item.ingredient_id,
      quantity: item.quantity,
      unit: item.unit,
      notes: item.notes,
    }));

    const { error: itemsError } = await supabaseAdmin.from('prep_list_items').insert(prepItems);

    if (itemsError) {
      const pgItemsError = itemsError as PostgrestError;
      logger.warn('[Prep Lists API] Warning: Could not create prep list items:', {
        error: pgItemsError.message,
        code: pgItemsError.code,
        prepListId: createdList.id,
      });
      // Don't fail the entire request, just log the error
    }
  }

  return createdList;
}
