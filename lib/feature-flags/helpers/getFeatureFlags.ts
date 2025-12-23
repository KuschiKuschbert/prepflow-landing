import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import type { FeatureFlag } from '../feature-flags';

/**
 * Get all feature flags
 */
export async function getFeatureFlags(userId?: string): Promise<FeatureFlag[]> {
  if (!supabaseAdmin) {
    return [];
  }

  try {
    let query = supabaseAdmin.from('feature_flags').select('*').order('flag_key');

    if (userId) {
      query = query.or(`user_id.eq.${userId},user_id.is.null`);
    } else {
      query = query.is('user_id', null);
    }

    const { data, error } = await query;

    if (error) {
      logger.error('[Feature Flags] Error fetching flags:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    logger.error('[Feature Flags] Unexpected error:', error);
    return [];
  }
}

