import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Delete a supplier.
 *
 * @param {string} id - Supplier ID
 * @param {string} userId - User ID
 * @param {SupabaseClient} supabase - Supabase client
 * @returns {Promise<void>}
 * @throws {Error} If delete fails
 */
export async function deleteSupplier(
  id: string,
  userId: string,
  supabase: SupabaseClient,
): Promise<void> {
  if (!supabase) {
    logger.error('[Suppliers API] Database connection not available for deleteSupplier');
    throw ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500);
  }

  const { error } = await supabase.from('suppliers').delete().eq('id', id).eq('user_id', userId);

  if (error) {
    logger.error('[Suppliers API] Database error deleting supplier:', {
      error: error.message,
      code: error.code,
      context: { endpoint: '/api/suppliers', operation: 'DELETE', supplierId: id },
    });
    throw ApiErrorHandler.fromSupabaseError(error, 500);
  }
}
