import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import type { FeatureFlag } from '../feature-flags';

/**
 * Set a feature flag
 */
export async function setFeatureFlag(
  flagKey: string,
  enabled: boolean,
  userId?: string,
  description?: string,
): Promise<FeatureFlag | null> {
  if (!supabaseAdmin) {
    return null;
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('feature_flags')
      .upsert(
        {
          flag_key: flagKey,
          enabled,
          user_id: userId || null,
          description: description || null,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'flag_key,user_id',
        },
      )
      .select()
      .single();

    if (error) {
      logger.error('[Feature Flags] Error setting flag:', error);
      return null;
    }

    return data;
  } catch (error) {
    logger.error('[Feature Flags] Unexpected error:', error);
    return null;
  }
}
