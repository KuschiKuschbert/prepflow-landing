import { supabaseAdmin } from '@/lib/supabase';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';

interface UpdatePrepListParams {
  id: string;
  kitchenSectionId?: string;
  name?: string;
  notes?: string;
  status?: string;
  items?: Array<{
    ingredientId: string;
    quantity: string;
    unit: string;
    notes?: string;
  }>;
}

export async function updatePrepList(params: UpdatePrepListParams) {
  if (!supabaseAdmin) {
    throw ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500);
  }

  const { id, kitchenSectionId, name, notes, status, items } = params;

  const updateData: any = {
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
    logger.error('[Prep Lists API] Database error updating prep list:', {
      error: error.message,
      code: (error as any).code,
      prepListId: id,
    });
    throw ApiErrorHandler.fromSupabaseError(error, 500);
  }

  // Update items if provided
  if (items !== undefined) {
    // Delete existing items
    const { error: deleteItemsError } = await supabaseAdmin
      .from('prep_list_items')
      .delete()
      .eq('prep_list_id', id);

    if (deleteItemsError) {
      logger.warn('[Prep Lists API] Warning: Could not delete existing prep list items:', {
        error: deleteItemsError.message,
        code: (deleteItemsError as any).code,
        prepListId: id,
      });
    }

    // Add new items
    if (items.length > 0) {
      const prepItems = items.map((item: any) => ({
        prep_list_id: id,
        ingredient_id: item.ingredientId,
        quantity: item.quantity,
        unit: item.unit,
        notes: item.notes,
      }));

      const { error: insertItemsError } = await supabaseAdmin
        .from('prep_list_items')
        .insert(prepItems);

      if (insertItemsError) {
        logger.error('[Prep Lists API] Error inserting prep list items:', {
          error: insertItemsError.message,
          code: (insertItemsError as any).code,
          prepListId: id,
        });
        throw ApiErrorHandler.fromSupabaseError(insertItemsError, 500);
      }
    }
  }

  return data;
}
