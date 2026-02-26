import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Create a new supplier price list.
 *
 * @param {Object} data - Price list data
 * @param {SupabaseClient} supabase - Supabase client
 * @returns {Promise<Object>} Created price list with supplier relation
 */
export async function createPriceList(
  data: {
    supplier_id: string;
    document_name: string;
    document_url: string;
    effective_date?: string | null;
    expiry_date?: string | null;
    is_current: boolean;
    notes?: string | null;
  },
  supabase: SupabaseClient,
) {
  const { data: created, error } = await supabase
    .from('supplier_price_lists')
    .insert(data)
    .select('*')
    .single();

  if (error) {
    logger.error('[Supplier Price Lists API] Error creating price list:', {
      error: error.message,
      context: { endpoint: '/api/supplier-price-lists', operation: 'createPriceList' },
    });
    throw ApiErrorHandler.createError(error.message, 'DATABASE_ERROR', 500, error);
  }
  return created;
}
