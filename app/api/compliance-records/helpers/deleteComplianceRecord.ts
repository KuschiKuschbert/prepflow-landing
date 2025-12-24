import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Delete a compliance record.
 *
 * @param {string} id - Compliance record ID
 * @returns {Promise<void>}
 * @throws {Error} If delete fails
 */
export async function deleteComplianceRecord(id: string): Promise<void> {
  if (!supabaseAdmin) {
    logger.error(
      '[Compliance Records API] Database connection not available for deleteComplianceRecord',
    );
    throw ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500);
  }

  const { error } = await supabaseAdmin.from('compliance_records').delete().eq('id', id);

  if (error) {
    logger.error('[Compliance Records API] Database error deleting record:', {
      error: error.message,
      code: (error as any).code,
      context: { endpoint: '/api/compliance-records', operation: 'DELETE', recordId: id },
    });
    throw ApiErrorHandler.fromSupabaseError(error, 500);
  }
}
