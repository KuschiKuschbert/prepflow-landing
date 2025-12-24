/**
 * Update sync log retry information.
 */
import { supabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import { ApiErrorHandler } from '@/lib/api-error-handler';

/**
 * Update sync log retry information.
 */
export async function updateSyncLogRetry(
  logId: string,
  retryInfo: {
    retry_count: number;
    next_retry_at: string | null;
    status?: 'retrying' | 'error';
  },
): Promise<void> {
  if (!supabaseAdmin) {
    throw ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500);
  }

  try {
    const updateData: any = {
      retry_count: retryInfo.retry_count,
      next_retry_at: retryInfo.next_retry_at,
    };

    if (retryInfo.status) {
      updateData.status = retryInfo.status;
    }

    const { error } = await supabaseAdmin
      .from('square_sync_logs')
      .update(updateData)
      .eq('id', logId);

    if (error) {
      logger.error('[Square Sync Log] Error updating retry info:', {
        error: error.message,
        code: (error as any).code,
        logId,
        retryInfo,
        context: { endpoint: 'updateSyncLogRetry', operation: 'update' },
      });

      throw ApiErrorHandler.fromSupabaseError(error, 500);
    }
  } catch (error: any) {
    if (error.status) {
      throw error;
    }

    logger.error('[Square Sync Log] Unexpected error updating retry info:', {
      error: error.message,
      logId,
      retryInfo,
      context: { endpoint: 'updateSyncLogRetry', operation: 'update' },
    });

    throw ApiErrorHandler.createError('Failed to update retry info', 'DATABASE_ERROR', 500);
  }
}
