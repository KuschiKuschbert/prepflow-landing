import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { z } from 'zod';
import { updateOrderListSchema } from './schemas';

export async function updateOrderList(
  id: string,
  body: z.infer<typeof updateOrderListSchema>,
): Promise<{ success: boolean; message: string; data: unknown } | { error: unknown; status: number }> {
  if (!supabaseAdmin) {
    return {
      error: ApiErrorHandler.createError(
        'Database connection not available',
        'DATABASE_ERROR',
        500,
      ),
      status: 500,
    };
  }

  const { supplierId, name, notes, status, items } = body;

  const updateData: unknown = { updated_at: new Date().toISOString() };
  if (supplierId !== undefined) updateData.supplier_id = supplierId;
  if (name !== undefined) updateData.name = name;
  if (notes !== undefined) updateData.notes = notes;
  if (status !== undefined) updateData.status = status;

  const { data, error } = await supabaseAdmin
    .from('order_lists')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    logger.error('[Order Lists API] Database error updating order list:', {
      error: error.message,
      code: (error as unknown).code,
      orderListId: id,
    });
    const apiError = ApiErrorHandler.fromSupabaseError(error, 500);
    return { error: apiError, status: apiError.status || 500 };
  }

  if (items !== undefined) {
    const { error: deleteItemsError } = await supabaseAdmin
      .from('order_list_items')
      .delete()
      .eq('order_list_id', id);

    if (deleteItemsError) {
      logger.warn('[Order Lists API] Warning: Could not delete existing order list items:', {
        error: deleteItemsError.message,
        code: (deleteItemsError as unknown).code,
        orderListId: id,
      });
    }

    if (items.length > 0) {
      const orderItems = items.map((item: unknown) => ({
        order_list_id: id,
        ingredient_id: item.ingredientId,
        quantity: item.quantity,
        unit: item.unit,
        notes: item.notes,
      }));

      const { error: insertItemsError } = await supabaseAdmin
        .from('order_list_items')
        .insert(orderItems);

      if (insertItemsError) {
        logger.error('[Order Lists API] Error inserting order list items:', {
          error: insertItemsError.message,
          code: (insertItemsError as unknown).code,
          orderListId: id,
        });
        return {
          error: ApiErrorHandler.createError(
            'Failed to update order list items',
            'DATABASE_ERROR',
            500,
            {
              details: insertItemsError.message,
            },
          ),
          status: 500,
        };
      }
    }
  }

  return { success: true, message: 'Order list updated successfully', data };
}
