import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Check user-specific feature flag
 */
export async function checkUserFlag(
  flagKey: string,
  userId: string,
): Promise<{ enabled: boolean; found: boolean }> {
  if (!supabaseAdmin) {
    return { enabled: false, found: false };
  }

  try {
    const { data: userFlag, error: userFlagError } = await supabaseAdmin
      .from('feature_flags')
      .select('enabled')
      .eq('flag_key', flagKey)
      .eq('user_id', userId)
      .single();

    if (userFlagError && userFlagError.code !== 'PGRST116') {
      logger.warn('[Feature Flags] Error fetching user flag:', {
        error: userFlagError.message,
        flagKey,
        userId,
      });
    }

    if (userFlag) {
      return { enabled: userFlag.enabled, found: true };
    }

    return { enabled: false, found: false };
  } catch (error) {
    logger.warn('[Feature Flags] Unexpected error checking user flag:', {
      error: error instanceof Error ? error.message : String(error),
      flagKey,
      userId,
    });
    return { enabled: false, found: false };
  }
}
