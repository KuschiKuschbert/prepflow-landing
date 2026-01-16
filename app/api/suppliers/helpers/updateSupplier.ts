import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { buildSupplierData } from './buildSupplierData';

/**
 * Update a supplier.
 *
 * @param {string} id - Supplier ID
 * @param {Object} updates - Update data
 * @returns {Promise<Object>} Updated supplier
 * @throws {Error} If update fails
 */
export async function updateSupplier(id: string, updates: unknown) {
  if (!supabaseAdmin) {
    logger.error('[API] Database connection not available');
    throw ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500);
  }

  const updateData = buildSupplierData({
    ...(updates as any),
    supplier_name: (updates as any).name || (updates as any).supplier_name,
  });

  const { data, error } = await supabaseAdmin
    .from('suppliers')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    logger.error('[Suppliers API] Database error updating supplier:', {
      error: error.message,
      code: error.code,
      context: { endpoint: '/api/suppliers', operation: 'PUT', supplierId: id },
    });
    throw ApiErrorHandler.fromSupabaseError(error, 500);
  }

  return data;
}
