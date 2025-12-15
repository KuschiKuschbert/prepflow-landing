import { supabaseAdmin } from './supabase';
import { logger } from './logger';
import type { TierSlug, EntitlementConfig } from './tier-config';
import { getDefaultTierConfig, getDefaultFeatureTierMapping } from './tier-config';

// In-memory cache for tier configs (5-minute TTL)
const tierConfigCache = new Map<TierSlug, { config: EntitlementConfig; expiresAt: number }>();
const featureMappingCache = new Map<string, { tier: TierSlug; expiresAt: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Check if tier config cache is invalidated.
 */
async function isCacheInvalidated(): Promise<boolean> {
  if (!supabaseAdmin) return false;

  try {
    const { data } = await supabaseAdmin
      .from('tier_config_cache')
      .select('invalidated_at')
      .eq('cache_key', 'tier_configs')
      .maybeSingle();

    if (!data) return false;

    // Check if cache was invalidated in the last 5 minutes
    const invalidatedAt = new Date(data.invalidated_at);
    const now = new Date();
    return now.getTime() - invalidatedAt.getTime() < CACHE_TTL_MS;
  } catch {
    return false;
  }
}

/**
 * Get tier configuration from database.
 * Falls back to code defaults if DB unavailable or tier not found.
 */
export async function getTierConfigFromDB(tierSlug: TierSlug): Promise<EntitlementConfig | null> {
  if (!supabaseAdmin) {
    return getDefaultTierConfig(tierSlug);
  }

  // Check cache first
  const cached = tierConfigCache.get(tierSlug);
  if (cached && cached.expiresAt > Date.now() && !(await isCacheInvalidated())) {
    return cached.config;
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('tier_configurations')
      .select('features, limits')
      .eq('tier_slug', tierSlug)
      .eq('is_active', true)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      logger.warn('[Tier Config DB] Error fetching tier config:', {
        error: error.message,
        tierSlug,
      });
      return getDefaultTierConfig(tierSlug);
    }

    if (!data) {
      // Tier not found in DB, use code defaults
      return getDefaultTierConfig(tierSlug);
    }

    const config: EntitlementConfig = {
      features: (data.features as Record<string, boolean>) || {},
      limits: (data.limits as { recipes?: number; ingredients?: number }) || {},
    };

    // Cache the result
    tierConfigCache.set(tierSlug, {
      config,
      expiresAt: Date.now() + CACHE_TTL_MS,
    });

    return config;
  } catch (error) {
    logger.warn('[Tier Config DB] Error fetching tier config:', {
      error: error instanceof Error ? error.message : String(error),
      tierSlug,
    });
    return getDefaultTierConfig(tierSlug);
  }
}

/**
 * Get all tier configurations from database.
 */
export async function getAllTierConfigsFromDB(): Promise<Record<TierSlug, EntitlementConfig>> {
  const tiers: TierSlug[] = ['starter', 'pro', 'business'];
  const configs: Record<TierSlug, EntitlementConfig> = {} as Record<TierSlug, EntitlementConfig>;

  for (const tier of tiers) {
    const config = await getTierConfigFromDB(tier);
    if (config) {
      configs[tier] = config;
    }
  }

  return configs;
}

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

/**
 * Invalidate tier configuration cache.
 */
export async function invalidateTierCache(): Promise<void> {
  if (!supabaseAdmin) {
    // Clear in-memory cache
    tierConfigCache.clear();
    featureMappingCache.clear();
    return;
  }

  try {
    // Update cache invalidation timestamp
    await supabaseAdmin.from('tier_config_cache').upsert(
      {
        cache_key: 'tier_configs',
        invalidated_at: new Date().toISOString(),
      },
      { onConflict: 'cache_key' },
    );

    // Clear in-memory cache
    tierConfigCache.clear();
    featureMappingCache.clear();

    logger.dev('[Tier Config DB] Cache invalidated');
  } catch (error) {
    logger.warn('[Tier Config DB] Error invalidating cache:', {
      error: error instanceof Error ? error.message : String(error),
    });
    // Still clear in-memory cache
    tierConfigCache.clear();
    featureMappingCache.clear();
  }
}

