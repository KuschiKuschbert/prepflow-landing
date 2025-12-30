/**
 * Cache management for tier configs.
 */
import { supabaseAdmin } from '../../supabase';
import { logger } from '../../logger';
import type { TierSlug, EntitlementConfig } from '../../tier-config';

// In-memory cache for tier configs (5-minute TTL)
export const tierConfigCache = new Map<
  TierSlug,
  { config: EntitlementConfig; expiresAt: number }
>();
export const featureMappingCache = new Map<string, { tier: TierSlug; expiresAt: number }>();
export const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Check if tier config cache is invalidated.
 */
export async function isCacheInvalidated(): Promise<boolean> {
  if (!supabaseAdmin) return false;

  try {
    const { data, error } = await supabaseAdmin
      .from('tier_config_cache')
      .select('invalidated_at')
      .eq('cache_key', 'tier_configs')
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      logger.warn('[Tier Config DB] Error checking cache invalidation:', {
        error: error.message,
      });
      return false;
    }

    if (!data) return false;

    // Check if cache was invalidated in the last 5 minutes
    const invalidatedAt = new Date(data.invalidated_at);
    const now = new Date();
    return now.getTime() - invalidatedAt.getTime() < CACHE_TTL_MS;
  } catch {
    return false;
  }
}
