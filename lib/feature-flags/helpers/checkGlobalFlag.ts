import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Check global feature flag
 */
export async function checkGlobalFlag(flagKey: string): Promise<boolean> {
  if (!supabaseAdmin) {
    return false;
  }

  try {
    const { data: globalFlag, error: globalFlagError } = await supabaseAdmin
      .from('feature_flags')
      .select('enabled')
      .eq('flag_key', flagKey)
      .is('user_id', null)
      .single();

    if (globalFlagError && globalFlagError.code !== 'PGRST116') {
      logger.warn('[Feature Flags] Error fetching global flag:', {
        error: globalFlagError.message,
        flagKey,
      });
    }

    return globalFlag?.enabled || false;
  } catch (error) {
    logger.warn('[Feature Flags] Unexpected error checking global flag:', {
      error: error instanceof Error ? error.message : String(error),
      flagKey,
    });
    return false;
  }
}
