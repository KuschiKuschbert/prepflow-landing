import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { PostgrestError } from '@supabase/supabase-js';
import { PrepList, UpdatePrepListParams } from '../types';

export async function updatePrepList(params: UpdatePrepListParams) {
  if (!supabaseAdmin) {
    throw ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500);
  }

  const { id, kitchenSectionId, name, notes, status, items } = params;

  const updateData: Partial<PrepList> = {
    updated_at: new Date().toISOString(),
  };

  if (kitchenSectionId !== undefined) updateData.kitchen_section_id = kitchenSectionId;
  if (name !== undefined) updateData.name = name;
  if (notes !== undefined) updateData.notes = notes;
  if (status !== undefined) updateData.status = status;

  const { data, error } = await supabaseAdmin
    .from('prep_lists')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    const pgError = error as PostgrestError;
    logger.error('[Prep Lists API] Database error updating prep list:', {
      error: pgError.message,
      code: pgError.code,
      prepListId: id,
    });
    throw ApiErrorHandler.fromSupabaseError(pgError, 500);
  }

  // Update items if provided
  if (items !== undefined) {
    // Delete existing items
    const { error: deleteItemsError } = await supabaseAdmin
      .from('prep_list_items')
      .delete()
      .eq('prep_list_id', id);

    if (deleteItemsError) {
      const pgDeleteError = deleteItemsError as PostgrestError;
      logger.warn('[Prep Lists API] Warning: Could not delete existing prep list items:', {
        error: pgDeleteError.message,
        code: pgDeleteError.code,
        prepListId: id,
      });
    }

    // Add new items
    if (items.length > 0) {
      const prepItems = items.map((item) => ({
        prep_list_id: id,
        ingredient_id: item.ingredient_id,
        quantity: item.quantity,
        unit: item.unit,
        notes: item.notes,
      }));

      const { error: insertItemsError } = await supabaseAdmin
        .from('prep_list_items')
        .insert(prepItems);

      if (insertItemsError) {
        const pgInsertError = insertItemsError as PostgrestError;
        logger.error('[Prep Lists API] Error inserting prep list items:', {
          error: pgInsertError.message,
          code: pgInsertError.code,
          prepListId: id,
        });
        throw ApiErrorHandler.fromSupabaseError(pgInsertError, 500);
      }
    }
  }

  return data as PrepList;
}
