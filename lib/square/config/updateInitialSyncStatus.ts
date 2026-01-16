/**
 * Update initial sync status.
 */
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Update initial sync status.
 */
export async function updateInitialSyncStatus(
  userId: string,
  statusUpdate: {
    status: 'pending' | 'in_progress' | 'completed' | 'failed';
    error?: string;
  },
): Promise<void> {
  if (!supabaseAdmin) {
    throw ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500);
  }

  try {
    const updateData: Record<string, unknown> = {
      initial_sync_status: statusUpdate.status,
      updated_at: new Date().toISOString(),
    };

    if (statusUpdate.status === 'in_progress' && !updateData.initial_sync_started_at) {
      updateData.initial_sync_started_at = new Date().toISOString();
    }

    if (statusUpdate.status === 'completed') {
      updateData.initial_sync_completed = true;
      updateData.initial_sync_completed_at = new Date().toISOString();
      updateData.initial_sync_error = null;
    }

    if (statusUpdate.status === 'failed' && statusUpdate.error) {
      updateData.initial_sync_error = statusUpdate.error;
    }

    const { error } = await supabaseAdmin
      .from('square_configurations')
      .update(updateData)
      .eq('user_id', userId);

    if (error) {
      logger.error('[Square Config] Error updating initial sync status:', {
        error: error.message,
        code: error.code,
        userId,
        context: { endpoint: 'updateInitialSyncStatus', operation: 'update' },
      });

      throw ApiErrorHandler.fromSupabaseError(error, 500);
    }
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'status' in error) {
      throw error;
    }

    logger.error('[Square Config] Unexpected error updating initial sync status:', {
      error: error instanceof Error ? error.message : String(error),
      userId,
      context: { endpoint: 'updateInitialSyncStatus', operation: 'update' },
    });

    throw ApiErrorHandler.createError(
      'Failed to update initial sync status',
      'DATABASE_ERROR',
      500,
    );
  }
}
