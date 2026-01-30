import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { SupabaseClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { updateOrderListSchema } from './schemas';

export async function updateOrderList(
  supabase: SupabaseClient,
  id: string,
  body: z.infer<typeof updateOrderListSchema>,
): Promise<
  { success: boolean; message: string; data: unknown } | { error: unknown; status: number }
> {
  if (!supabase) {
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

  const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (supplierId !== undefined) updateData.supplier_id = supplierId;
  if (name !== undefined) updateData.name = name;
  if (notes !== undefined) updateData.notes = notes;
  if (status !== undefined) updateData.status = status;

  const { data, error } = await supabase
    .from('order_lists')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    logger.error('[Order Lists API] Database error updating order list:', {
      error: error.message,
      code: error.code,
      orderListId: id,
    });
    const apiError = ApiErrorHandler.fromSupabaseError(error, 500);
    return { error: apiError, status: apiError.status || 500 };
  }

  if (items !== undefined) {
    const itemsError = await updateOrderListItems(supabase, id, items);
    if (itemsError) return itemsError;
  }

  return { success: true, message: 'Order list updated successfully', data };
}

async function updateOrderListItems(
  supabase: SupabaseClient,
  orderListId: string,
  items: NonNullable<z.infer<typeof updateOrderListSchema>['items']>,
): Promise<{ error: unknown; status: number } | null> {
  // Delete existing items
  const { error: deleteItemsError } = await supabase
    .from('order_list_items')
    .delete()
    .eq('order_list_id', orderListId);

  if (deleteItemsError) {
    const err = deleteItemsError as { code?: string; message?: string };
    logger.error('Error deleting old order list items', {
      error: err.message,
      code: err.code,
      orderListId,
    });
    // We log but might want to continue or fail. Previously it just logged.
    // Assuming we continue to try inserting new items as per original logic,
    // although typically this should probably be a transaction.
    // Original code just logged and continued.
  }

  if (items.length > 0) {
    const orderItems = items.map(item => ({
      order_list_id: orderListId,
      ingredient_id: item.ingredientId,
      quantity: item.quantity,
      unit: item.unit,
      notes: item.notes,
    }));

    const { error: insertItemsError } = await supabase.from('order_list_items').insert(orderItems);

    if (insertItemsError) {
      logger.error('[Order Lists API] Error inserting order list items:', {
        error: insertItemsError.message,
        code: insertItemsError.code,
        orderListId,
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

  return null;
}
