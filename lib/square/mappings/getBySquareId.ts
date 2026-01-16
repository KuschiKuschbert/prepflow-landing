/**
 * Get mapping by Square ID.
 */
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import type { SquareMapping } from './types';

/**
 * Get mapping by Square ID.
 */
export async function getMappingBySquareId(
  squareId: string,
  entityType: 'dish' | 'recipe' | 'ingredient' | 'employee' | 'location',
  userId: string,
  squareLocationId?: string | null,
): Promise<SquareMapping | null> {
  if (!supabaseAdmin) {
    logger.error('[Square Mappings] Database connection not available');
    return null;
  }

  try {
    let query = supabaseAdmin
      .from('square_mappings')
      .select('*')
      .eq('square_id', squareId)
      .eq('entity_type', entityType)
      .eq('user_id', userId);

    if (squareLocationId) {
      query = query.eq('square_location_id', squareLocationId);
    } else {
      query = query.is('square_location_id', null);
    }

    const { data, error } = await query.maybeSingle();

    if (error && error.code !== 'PGRST116') {
      logger.error('[Square Mappings] Error fetching mapping by Square ID:', {
        error: error.message,
        code: error.code,
        squareId,
        entityType,
        userId,
        context: { endpoint: 'getMappingBySquareId', operation: 'select' },
      });
      return null;
    }

    return data as SquareMapping | null;
  } catch (error: unknown) {
    logger.error('[Square Mappings] Unexpected error fetching mapping by Square ID:', {
      error: error instanceof Error ? error.message : String(error),
      squareId,
      entityType,
      userId,
      context: { endpoint: 'getMappingBySquareId', operation: 'select' },
    });
    return null;
  }
}
