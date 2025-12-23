import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Upsert sales data for a dish.
 *
 * @param {Object} salesData - Sales data
 * @returns {Promise<Array>} Upserted sales data
 * @throws {Error} If upsert fails
 */
export async function upsertSalesData(salesData: {
  dish_id: string;
  number_sold: number;
  popularity_percentage: number;
  date?: string;
}) {
  if (!supabaseAdmin) {
    logger.error('[API] Database connection not available');
    throw ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500);
  }

  const { data, error } = await supabaseAdmin
    .from('sales_data')
    .upsert(
      {
        dish_id: salesData.dish_id,
        number_sold: salesData.number_sold,
        popularity_percentage: salesData.popularity_percentage,
        date: salesData.date || new Date().toISOString().split('T')[0],
      },
      {
        onConflict: 'dish_id,date',
      },
    )
    .select();

  if (error) {
    logger.error('[helpers/upsertSalesData] Database error:', {
      error: error.message,
    });
    throw ApiErrorHandler.fromSupabaseError(error, 500);
  }

  if (error) {
    logger.error('[Performance API] Database error inserting sales data:', {
      error: error.message,
      code: (error as any).code,
      context: { endpoint: '/api/performance', operation: 'POST', table: 'sales_data' },
    });
    throw ApiErrorHandler.fromSupabaseError(error, 500);
  }

  return data || [];
}
