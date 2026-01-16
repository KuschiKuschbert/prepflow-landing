import { supabaseAdmin } from '@/lib/supabase';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';

/**
 * Update a supplier price list.
 *
 * @param {number} id - Price list ID
 * @param {Object} updateData - Update data
 * @returns {Promise<Object>} Updated price list with supplier relation
 */
export async function updatePriceList(id: number, updateData: unknown) {
  const { data: updated, error } = await supabaseAdmin!
    .from('supplier_price_lists')
    .update(updateData)
    .eq('id', id)
    .select(
      `
      *,
      suppliers (
        id,
        name,
        contact_person,
        email,
        phone
      )
    `,
    )
    .single();

  if (error) {
    logger.error('[Supplier Price Lists API] Error updating price list:', {
      error: error.message,
      context: { endpoint: '/api/supplier-price-lists', operation: 'updatePriceList' },
    });
    throw ApiErrorHandler.createError(error.message, 'DATABASE_ERROR', 500, error);
  }
  return updated;
}
