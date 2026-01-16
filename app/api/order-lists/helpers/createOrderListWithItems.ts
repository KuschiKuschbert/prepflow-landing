import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Create order list with items.
 *
 * @param {Object} orderListData - Order list data
 * @param {Array} items - Optional items array
 * @returns {Promise<Object>} Created order list
 * @throws {Error} If creation fails
 */
export async function createOrderListWithItems(
  orderListData: {
    user_id: string;
    supplier_id: number;
    name: string;
    notes?: string;
  },
  items?: Array<{ ingredientId: string; quantity: number; unit: string; notes?: string }>,
) {
  if (!supabaseAdmin) {
    logger.error('[API] Database connection not available');
    throw ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500);
  }

  // Create the order list
  const { data: orderList, error: orderError } = await supabaseAdmin!
    .from('order_lists')
    .insert({
      user_id: orderListData.user_id,
      supplier_id: orderListData.supplier_id,
      name: orderListData.name,
      notes: orderListData.notes,
      status: 'draft',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (orderError) {
    logger.error('[Order Lists API] Database error creating list:', {
      error: orderError.message,
      code: orderError.code,
      context: { endpoint: '/api/order-lists', operation: 'POST', table: 'order_lists' },
    });
    throw ApiErrorHandler.fromSupabaseError(orderError, 500);
  }

  // Add items if provided
  if (items && items.length > 0) {
    const orderItems = items.map(item => ({
      order_list_id: orderList.id,
      ingredient_id: item.ingredientId,
      quantity: item.quantity,
      unit: item.unit,
      notes: item.notes,
    }));

    const { error: itemsError } = await supabaseAdmin.from('order_list_items').insert(orderItems);

    if (itemsError) {
      logger.warn('[Order Lists API] Warning: Could not create order list items:', {
        error: itemsError.message,
        code: itemsError.code,
        context: { endpoint: '/api/order-lists', operation: 'POST', orderListId: orderList.id },
      });
    }
  }

  return orderList;
}
