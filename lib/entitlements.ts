import type { TierSlug } from './tier-config';
import { getDefaultTierConfig } from './tier-config';
import { getTierConfigFromDB } from './tier-config-db';

export interface UserEntitlements {
  userId: string;
  tier: TierSlug;
  features: Record<string, boolean>;
  limits?: {
    recipes?: number;
    ingredients?: number;
  };
}

/**
 * Get entitlements for a tier.
 * Uses database config if available, falls back to code defaults.
 */
export async function getEntitlementsForTierAsync(
  userId: string,
  tier: TierSlug,
): Promise<UserEntitlements> {
  const cfg = await getTierConfigFromDB(tier);
  if (!cfg) {
    // Fallback to default config if DB config not found
    return getEntitlementsForTier(userId, tier);
  }
  return {
    userId,
    tier,
    features: cfg.features,
    limits: cfg.limits,
  };
}

/**
 * Synchronous version that uses code defaults only.
 * Use getEntitlementsForTierAsync for database-backed configs.
 */
export function getEntitlementsForTier(userId: string, tier: TierSlug): UserEntitlements {
  const cfg = getDefaultTierConfig(tier);
  return { userId, tier, features: cfg.features, limits: cfg.limits };
}

/**
 * Get full entitlements for admin users.
 */
export function getAdminEntitlements(userId: string): UserEntitlements {
  return {
    userId,
    tier: 'business',
    features: {
      cogs: true,
      recipes: true,
      analytics: true,
      temperature: true,
      cleaning: true,
      compliance: true,
      curbos: true,
      employees: true,
      roster: true,
      ai_specials: true,
      square_pos: true,
    },
    limits: {
      recipes: 999999,
      ingredients: 999999,
    },
  };
}

export function hasFeature(entitlements: UserEntitlements, featureKey: string): boolean {
  return Boolean(entitlements.features[featureKey]);
}
