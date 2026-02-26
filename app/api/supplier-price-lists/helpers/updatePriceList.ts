import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Update a supplier price list.
 *
 * @param {number} id - Price list ID
 * @param {Object} updateData - Update data
 * @param {SupabaseClient} supabase - Supabase client
 * @returns {Promise<Object>} Updated price list with supplier relation
 */
export async function updatePriceList(id: string, updateData: unknown, supabase: SupabaseClient) {
  const { data: updated, error } = await supabase
    .from('supplier_price_lists')
    .update(updateData)
    .eq('id', id)
    .select('*')
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
