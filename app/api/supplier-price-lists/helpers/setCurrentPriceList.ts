import { supabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import { ApiErrorHandler } from '@/lib/api-error-handler';

/**
 * Set a price list as current and unset all others for the same supplier.
 *
 * @param {number} supplierId - Supplier ID
 * @param {number | null} excludeId - Optional ID to exclude from update
 * @returns {Promise<void>}
 */
export async function setCurrentPriceList(
  supplierId: number,
  excludeId: number | null = null,
): Promise<void> {
  if (!supabaseAdmin) {
    throw ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500);
  }

  let query = supabaseAdmin
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
