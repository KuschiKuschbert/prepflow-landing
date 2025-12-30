/**
 * Update last sync timestamp for a sync type.
 */
import { supabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import { ApiErrorHandler } from '@/lib/api-error-handler';

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
    const updateData: any = {
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
        code: (error as any).code,
        userId,
        syncType,
        context: { endpoint: 'updateLastSyncTimestamp', operation: 'update' },
      });

      throw ApiErrorHandler.fromSupabaseError(error, 500);
    }
  } catch (error: any) {
    if (error.status) {
      throw error;
    }

    logger.error('[Square Config] Unexpected error updating sync timestamp:', {
      error: error.message,
      userId,
      syncType,
      context: { endpoint: 'updateLastSyncTimestamp', operation: 'update' },
    });

    throw ApiErrorHandler.createError('Failed to update sync timestamp', 'DATABASE_ERROR', 500);
  }
}



