/**
 * Delete a mapping.
 */
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

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
        code: error.code,
        mappingId,
        context: { endpoint: 'deleteMapping', operation: 'delete' },
      });

      throw ApiErrorHandler.fromSupabaseError(error, 500);
    }
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'status' in error) {
      throw error;
    }

    logger.error('[Square Mappings] Unexpected error deleting mapping:', {
      error: error instanceof Error ? error.message : String(error),
      mappingId,
      context: { endpoint: 'deleteMapping', operation: 'delete' },
    });

    throw ApiErrorHandler.createError('Failed to delete mapping', 'DATABASE_ERROR', 500);
  }
}
