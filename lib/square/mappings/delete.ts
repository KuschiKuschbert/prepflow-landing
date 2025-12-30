/**
 * Delete a mapping.
 */
import { supabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import { ApiErrorHandler } from '@/lib/api-error-handler';

/**
 * Delete a mapping.
 */
export async function deleteMapping(mappingId: string): Promise<void> {
  if (!supabaseAdmin) {
    throw ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500);
  }

  try {
    const { error } = await supabaseAdmin.from('square_mappings').delete().eq('id', mappingId);

    if (error) {
      logger.error('[Square Mappings] Error deleting mapping:', {
        error: error.message,
        code: (error as any).code,
        mappingId,
        context: { endpoint: 'deleteMapping', operation: 'delete' },
      });

      throw ApiErrorHandler.fromSupabaseError(error, 500);
    }
  } catch (error: any) {
    if (error.status) {
      throw error;
    }

    logger.error('[Square Mappings] Unexpected error deleting mapping:', {
      error: error.message,
      mappingId,
      context: { endpoint: 'deleteMapping', operation: 'delete' },
    });

    throw ApiErrorHandler.createError('Failed to delete mapping', 'DATABASE_ERROR', 500);
  }
}




