/**
 * Update last sync timestamp for a sync type.
 */
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Update last sync timestamp for a sync type.
 */
export async function updateLastSyncTimestamp(
  userId: string,
  syncType: 'full' | 'menu' | 'staff' | 'sales',
): Promise<void> {
  if (!supabaseAdmin) {
    throw ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500);
  }

  try {
    const timestamp = new Date().toISOString();
    const updateData: Record<string, unknown> = {
      updated_at: timestamp,
    };

    switch (syncType) {
      case 'full':
        updateData.last_full_sync_at = timestamp;
        break;
      case 'menu':
        updateData.last_menu_sync_at = timestamp;
        break;
      case 'staff':
        updateData.last_staff_sync_at = timestamp;
        break;
      case 'sales':
        updateData.last_sales_sync_at = timestamp;
        break;
    }

    const { error } = await supabaseAdmin
      .from('square_configurations')
      .update(updateData)
      .eq('user_id', userId);

    if (error) {
      logger.error('[Square Config] Error updating sync timestamp:', {
        error: error.message,
        code: error.code,
        userId,
        syncType,
        context: { endpoint: 'updateLastSyncTimestamp', operation: 'update' },
      });

      throw ApiErrorHandler.fromSupabaseError(error, 500);
    }
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'status' in error) {
      throw error;
    }

    logger.error('[Square Config] Unexpected error updating sync timestamp:', {
      error: error instanceof Error ? error.message : String(error),
      userId,
      syncType,
      context: { endpoint: 'updateLastSyncTimestamp', operation: 'update' },
    });

    throw ApiErrorHandler.createError('Failed to update sync timestamp', 'DATABASE_ERROR', 500);
  }
}
