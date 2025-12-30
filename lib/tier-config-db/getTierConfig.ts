/**
 * Get tier configuration from database.
 */
import { supabaseAdmin } from '../supabase';
import { logger } from '../logger';
import type { TierSlug, EntitlementConfig } from '../tier-config';
import { getDefaultTierConfig } from '../tier-config';
import { tierConfigCache, isCacheInvalidated, CACHE_TTL_MS } from './helpers/cacheManagement';

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




