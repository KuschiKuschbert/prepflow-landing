import { getEntitlementsForTier, hasFeature } from '@/lib/entitlements';
import type { TierSlug } from '@/lib/tier-config';
import { getUserTier } from './tierCache';

/**
 * Evaluate gate based on user tier
 */
export async function evaluateTierGate(
  featureKey: string,
  userEmail: string,
): Promise<{ allowed: boolean; reason?: string }> {
  try {
    const tier = await getUserTier(userEmail);

    const { getTierConfigFromDB } = await import('@/lib/tier-config-db');
    const tierConfig = await getTierConfigFromDB(tier);
    const ent = tierConfig
      ? { userId: userEmail, tier, features: tierConfig.features }
      : getEntitlementsForTier(userEmail, tier);

    const ok = hasFeature(ent, featureKey);

    if (ok) {
      return { allowed: true };
    }

    const { getFeatureTierMapping } = await import('@/lib/tier-config-db');
    const requiredTier = await getFeatureTierMapping(featureKey);

    if (requiredTier) {
      const tierOrder: TierSlug[] = ['starter', 'pro', 'business'];
      const currentTierIndex = tierOrder.indexOf(tier);
      const requiredTierIndex = tierOrder.indexOf(requiredTier);

      if (currentTierIndex < requiredTierIndex) {
        return {
          allowed: false,
          reason: 'upgrade-required',
        };
      }
    }

    return { allowed: false, reason: 'feature-disabled' };
  } catch (error) {
    throw error;
  }
}
