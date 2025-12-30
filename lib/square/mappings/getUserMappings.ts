/**
 * Get all mappings for a user and entity type.
 */
import { supabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import type { SquareMapping } from './types';

/**
 * Get all mappings for a user and entity type.
 */
export async function getUserMappings(
  userId: string,
  entityType?: string,
): Promise<SquareMapping[]> {
  if (!supabaseAdmin) {
    return [];
  }

  try {
    let query = supabaseAdmin
      .from('square_mappings')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (entityType) {
      query = query.eq('entity_type', entityType);
    }

    const { data, error } = await query;

    if (error) {
      logger.error('[Square Mappings] Error fetching user mappings:', {
        error: error.message,
        code: (error as any).code,
        userId,
        entityType,
        context: { endpoint: 'getUserMappings', operation: 'select' },
      });
      return [];
    }

    return (data || []) as SquareMapping[];
  } catch (error: any) {
    logger.error('[Square Mappings] Unexpected error fetching user mappings:', {
      error: error.message,
      userId,
      entityType,
      context: { endpoint: 'getUserMappings', operation: 'select' },
    });
    return [];
  }
}



