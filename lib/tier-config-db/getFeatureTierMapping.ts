/**
 * Get feature tier mapping from database.
 */
import { supabaseAdmin } from '../supabase';
import { logger } from '../logger';
import type { TierSlug } from '../tier-config';
import { getDefaultFeatureTierMapping } from '../tier-config';
import { featureMappingCache, isCacheInvalidated, CACHE_TTL_MS } from './helpers/cacheManagement';

/**
 * Get feature tier mapping from database.
 * Falls back to code defaults if DB unavailable.
 */
export async function getFeatureTierMapping(featureKey: string): Promise<TierSlug | null> {
  if (!supabaseAdmin) {
    const defaults = getDefaultFeatureTierMapping();
    return defaults[featureKey] || null;
  }

  // Check cache first
  const cached = featureMappingCache.get(featureKey);
  if (cached && cached.expiresAt > Date.now() && !(await isCacheInvalidated())) {
    return cached.tier;
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('feature_tier_mapping')
      .select('required_tier')
      .eq('feature_key', featureKey)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      logger.warn('[Tier Config DB] Error fetching feature mapping:', {
        error: error.message,
        featureKey,
      });
      const defaults = getDefaultFeatureTierMapping();
      return defaults[featureKey] || null;
    }

    if (!data) {
      // Feature not found in DB, use code defaults
      const defaults = getDefaultFeatureTierMapping();
      return defaults[featureKey] || null;
    }

    const tier = data.required_tier as TierSlug;

    // Cache the result
    featureMappingCache.set(featureKey, {
      tier,
      expiresAt: Date.now() + CACHE_TTL_MS,
    });

    return tier;
  } catch (error) {
    logger.warn('[Tier Config DB] Error fetching feature mapping:', {
      error: error instanceof Error ? error.message : String(error),
      featureKey,
    });
    const defaults = getDefaultFeatureTierMapping();
    return defaults[featureKey] || null;
  }
}



