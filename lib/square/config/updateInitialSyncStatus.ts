/**
 * Update initial sync status.
 */
import { supabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import { ApiErrorHandler } from '@/lib/api-error-handler';

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
    const updateData: any = {
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
        code: (error as any).code,
        userId,
        context: { endpoint: 'updateInitialSyncStatus', operation: 'update' },
      });

      throw ApiErrorHandler.fromSupabaseError(error, 500);
    }
  } catch (error: any) {
    if (error.status) {
      throw error;
    }

    logger.error('[Square Config] Unexpected error updating initial sync status:', {
      error: error.message,
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


