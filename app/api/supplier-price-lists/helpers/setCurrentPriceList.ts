import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Set a price list as current and unset all others for the same supplier.
 *
 * @param {number} supplierId - Supplier ID
 * @param {number | null} excludeId - Optional ID to exclude from update
 * @param {SupabaseClient} supabase - Supabase client
 * @returns {Promise<void>}
 */
export async function setCurrentPriceList(
  supplierId: string,
  excludeId: string | null = null,
  supabase: SupabaseClient,
): Promise<void> {
  if (!supabase) {
    throw ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500);
  }

  let query = supabase
    .from('supplier_price_lists')
    .update({ is_current: false })
    .eq('supplier_id', supplierId);

  if (excludeId) {
    query = query.neq('id', excludeId);
  }

  const { error } = await query;

  if (error) {
    logger.error('[Supplier Price Lists API] Error setting current price list:', {
      error: error.message,
      supplierId,
      excludeId,
      context: { endpoint: '/api/supplier-price-lists', operation: 'setCurrentPriceList' },
    });
    throw ApiErrorHandler.createError(error.message, 'DATABASE_ERROR', 500, error);
  }
}
