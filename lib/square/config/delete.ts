/**
 * Delete Square configuration for a user.
 */
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Delete Square configuration for a user.
 */
export async function deleteSquareConfig(userId: string): Promise<void> {
  if (!supabaseAdmin) {
    throw ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500);
  }

  try {
    const { error } = await supabaseAdmin
      .from('square_configurations')
      .delete()
      .eq('user_id', userId);

    if (error) {
      logger.error('[Square Config] Error deleting configuration:', {
        error: error.message,
        code: error.code,
        userId,
        context: { endpoint: 'deleteSquareConfig', operation: 'delete' },
      });

      throw ApiErrorHandler.fromSupabaseError(error, 500);
    }

    // Clear cached client instance
    const { clearSquareClientCache } = await import('../client');
    clearSquareClientCache(userId);
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'status' in error) {
      throw error;
    }

    logger.error('[Square Config] Unexpected error deleting configuration:', {
      error: error instanceof Error ? error.message : String(error),
      userId,
      context: { endpoint: 'deleteSquareConfig', operation: 'delete' },
    });

    throw ApiErrorHandler.createError(
      'Failed to delete Square configuration',
      'DATABASE_ERROR',
      500,
    );
  }
}
