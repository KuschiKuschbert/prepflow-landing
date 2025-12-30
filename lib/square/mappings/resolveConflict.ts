/**
 * Resolve a mapping conflict.
 */
import { supabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import { ApiErrorHandler } from '@/lib/api-error-handler';

/**
 * Resolve a mapping conflict.
 */
export async function resolveConflict(
  mappingId: string,
  resolution: 'square' | 'prepflow' | 'manual',
): Promise<void> {
  if (!supabaseAdmin) {
    throw ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500);
  }

  try {
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    // Update sync direction based on resolution
    if (resolution === 'square') {
      updateData.sync_direction = 'square_to_prepflow';
    } else if (resolution === 'prepflow') {
      updateData.sync_direction = 'prepflow_to_square';
    } else {
      // Manual resolution - keep bidirectional but mark in metadata
      updateData.sync_direction = 'bidirectional';
      updateData.sync_metadata = {
        conflict_resolved: true,
        resolution: 'manual',
        resolved_at: new Date().toISOString(),
      };
    }

    const { error } = await supabaseAdmin
      .from('square_mappings')
      .update(updateData)
      .eq('id', mappingId);

    if (error) {
      logger.error('[Square Mappings] Error resolving conflict:', {
        error: error.message,
        code: (error as any).code,
        mappingId,
        resolution,
        context: { endpoint: 'resolveConflict', operation: 'update' },
      });

      throw ApiErrorHandler.fromSupabaseError(error, 500);
    }
  } catch (error: any) {
    if (error.status) {
      throw error;
    }

    logger.error('[Square Mappings] Unexpected error resolving conflict:', {
      error: error.message,
      mappingId,
      resolution,
      context: { endpoint: 'resolveConflict', operation: 'update' },
    });

    throw ApiErrorHandler.createError('Failed to resolve conflict', 'DATABASE_ERROR', 500);
  }
}




