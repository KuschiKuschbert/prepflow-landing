/**
 * Entitlement helper functions.
 */
import type { TierSlug } from '@/lib/tier-config';
import type { SubscriptionData, UserEntitlements } from '../useEntitlements';

export function hasFeatureHelper(entitlements: UserEntitlements | null, featureKey: string): boolean {
  if (!entitlements) return false;
  return Boolean(entitlements.features[featureKey]);
}

export function getUpgradeTierHelper(tier: TierSlug): TierSlug | null {
  if (tier === 'starter') return 'pro';
  if (tier === 'pro') return 'business';
  return null;
}

export function checkLimitHelper(
  usage: SubscriptionData['usage'] | null,
  entitlements: UserEntitlements | null,
  resourceType: 'recipes' | 'ingredients',
): { used: number; limit: number | null; atLimit: boolean } {
  if (!usage || !entitlements?.limits) return { used: 0, limit: null, atLimit: false };
  const limit = entitlements.limits[resourceType];
  const used = resourceType === 'recipes' ? usage.recipes : usage.ingredients;
  return { used, limit: limit ?? null, atLimit: limit !== undefined && limit !== null && used >= limit };
}
