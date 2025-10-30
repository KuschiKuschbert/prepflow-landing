import type { TierSlug } from './tier-config';
import { TIER_TO_ENTITLEMENTS } from './tier-config';

export interface UserEntitlements {
  userId: string;
  tier: TierSlug;
  features: Record<string, boolean>;
}

export function getEntitlementsForTier(userId: string, tier: TierSlug): UserEntitlements {
  const cfg = TIER_TO_ENTITLEMENTS[tier];
  return { userId, tier, features: cfg.features };
}

export function hasFeature(entitlements: UserEntitlements, featureKey: string): boolean {
  return Boolean(entitlements.features[featureKey]);
}
