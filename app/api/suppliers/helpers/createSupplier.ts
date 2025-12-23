import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { buildSupplierData } from './buildSupplierData';

/**
 * Create a supplier.
 *
 * @param {Object} supplierData - Supplier data
 * @returns {Promise<Object>} Created supplier
 * @throws {Error} If creation fails
 */
export async function createSupplier(supplierData: any) {
  if (!supabaseAdmin) {
    logger.error('[API] Database connection not available');
    throw ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500);
  }

  const { data, error } = await supabaseAdmin
    .from('suppliers')
    .insert(buildSupplierData(supplierData))
    .select()
    .single();

  if (error) {
    logger.error('[Suppliers API] Database error creating supplier:', {
      error: error.message,
      code: (error as any).code,
      context: { endpoint: '/api/suppliers', operation: 'POST', table: 'suppliers' },
    });
    throw ApiErrorHandler.fromSupabaseError(error, 500);
  }

  return data;
}
