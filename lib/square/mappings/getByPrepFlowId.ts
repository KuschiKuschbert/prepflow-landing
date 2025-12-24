/**
 * Get mapping by PrepFlow ID.
 */
import { supabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import type { SquareMapping } from './types';

/**
 * Get mapping by PrepFlow ID.
 */
export async function getMappingByPrepFlowId(
  prepflowId: string,
  entityType: 'dish' | 'recipe' | 'ingredient' | 'employee' | 'location',
  userId: string,
): Promise<SquareMapping | null> {
  if (!supabaseAdmin) {
    logger.error('[Square Mappings] Database connection not available');
    return null;
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('square_mappings')
      .select('*')
      .eq('prepflow_id', prepflowId)
      .eq('entity_type', entityType)
      .eq('user_id', userId)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      logger.error('[Square Mappings] Error fetching mapping by PrepFlow ID:', {
        error: error.message,
        code: (error as any).code,
        prepflowId,
        entityType,
        userId,
        context: { endpoint: 'getMappingByPrepFlowId', operation: 'select' },
      });
      return null;
    }

    return data as SquareMapping | null;
  } catch (error: any) {
    logger.error('[Square Mappings] Unexpected error fetching mapping by PrepFlow ID:', {
      error: error.message,
      prepflowId,
      entityType,
      userId,
      context: { endpoint: 'getMappingByPrepFlowId', operation: 'select' },
    });
    return null;
  }
}
