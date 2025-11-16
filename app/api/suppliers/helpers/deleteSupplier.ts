import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Delete a supplier.
 *
 * @param {string} id - Supplier ID
 * @returns {Promise<void>}
 * @throws {Error} If delete fails
 */
export async function deleteSupplier(id: string): Promise<void> {
  if (!supabaseAdmin) throw new Error('Database connection not available');

  const { error } = await supabaseAdmin.from('suppliers').delete().eq('id', id);

  if (error) {
    logger.error('[Suppliers API] Database error deleting supplier:', {
      error: error.message,
      code: (error as any).code,
      context: { endpoint: '/api/suppliers', operation: 'DELETE', supplierId: id },
    });
    throw ApiErrorHandler.fromSupabaseError(error, 500);
  }
}
