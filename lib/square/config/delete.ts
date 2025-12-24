/**
 * Delete Square configuration for a user.
 */
import { supabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import { ApiErrorHandler } from '@/lib/api-error-handler';

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
        code: (error as any).code,
        userId,
        context: { endpoint: 'deleteSquareConfig', operation: 'delete' },
      });

      throw ApiErrorHandler.fromSupabaseError(error, 500);
    }

    // Clear cached client instance
    const { clearSquareClientCache } = await import('../client');
    clearSquareClientCache(userId);
  } catch (error: any) {
    if (error.status) {
      throw error;
    }

    logger.error('[Square Config] Unexpected error deleting configuration:', {
      error: error.message,
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
