import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Delete a feature flag
 */
export async function deleteFeatureFlag(flagKey: string, userId?: string): Promise<boolean> {
  if (!supabaseAdmin) {
    return false;
  }

  try {
    let query = supabaseAdmin.from('feature_flags').delete().eq('flag_key', flagKey);

    if (userId) {
      query = query.eq('user_id', userId);
    } else {
      query = query.is('user_id', null);
    }

    const { error } = await query;

    if (error) {
      logger.error('[Feature Flags] Error deleting flag:', error);
      return false;
    }

    return true;
  } catch (error) {
    logger.error('[Feature Flags] Unexpected error:', error);
    return false;
  }
}

