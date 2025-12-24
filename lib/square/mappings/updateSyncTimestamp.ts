/**
 * Update mapping sync timestamp.
 */
import { supabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import { ApiErrorHandler } from '@/lib/api-error-handler';

/**
 * Update mapping sync timestamp.
 */
export async function updateMappingSyncTimestamp(
  mappingId: string,
  direction: 'from_square' | 'to_square' | 'both',
): Promise<void> {
  if (!supabaseAdmin) {
    throw ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500);
  }

  try {
    const timestamp = new Date().toISOString();
    const updateData: any = {
      last_synced_at: timestamp,
      updated_at: timestamp,
    };

    if (direction === 'from_square' || direction === 'both') {
      updateData.last_synced_from_square = timestamp;
    }

    if (direction === 'to_square' || direction === 'both') {
      updateData.last_synced_to_square = timestamp;
    }

    const { error } = await supabaseAdmin
      .from('square_mappings')
      .update(updateData)
      .eq('id', mappingId);

    if (error) {
      logger.error('[Square Mappings] Error updating sync timestamp:', {
        error: error.message,
        code: (error as any).code,
        mappingId,
        direction,
        context: { endpoint: 'updateMappingSyncTimestamp', operation: 'update' },
      });

      throw ApiErrorHandler.fromSupabaseError(error, 500);
    }
  } catch (error: any) {
    if (error.status) {
      throw error;
    }

    logger.error('[Square Mappings] Unexpected error updating sync timestamp:', {
      error: error.message,
      mappingId,
      direction,
      context: { endpoint: 'updateMappingSyncTimestamp', operation: 'update' },
    });

    throw ApiErrorHandler.createError('Failed to update sync timestamp', 'DATABASE_ERROR', 500);
  }
}
