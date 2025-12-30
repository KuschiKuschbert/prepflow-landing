/**
 * Create a new Square mapping.
 */
import { supabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import type { SquareMapping, SquareMappingInput } from './types';

/**
 * Create a new Square mapping.
 */
export async function createMapping(mapping: SquareMappingInput): Promise<SquareMapping> {
  if (!supabaseAdmin) {
    throw ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500);
  }

  try {
    const mappingData = {
      user_id: mapping.user_id,
      entity_type: mapping.entity_type,
      prepflow_id: mapping.prepflow_id,
      square_id: mapping.square_id,
      square_location_id: mapping.square_location_id || null,
      sync_direction: mapping.sync_direction || 'bidirectional',
      sync_metadata: mapping.sync_metadata || null,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabaseAdmin
      .from('square_mappings')
      .insert(mappingData)
      .select()
      .single();

    if (error) {
      logger.error('[Square Mappings] Error creating mapping:', {
        error: error.message,
        code: (error as any).code,
        mapping,
        context: { endpoint: 'createMapping', operation: 'insert' },
      });

      throw ApiErrorHandler.fromSupabaseError(error, 500);
    }

    return data as SquareMapping;
  } catch (error: any) {
    if (error.status) {
      throw error;
    }

    logger.error('[Square Mappings] Unexpected error creating mapping:', {
      error: error.message,
      mapping,
      context: { endpoint: 'createMapping', operation: 'insert' },
    });

    throw ApiErrorHandler.createError('Failed to create mapping', 'DATABASE_ERROR', 500);
  }
}




