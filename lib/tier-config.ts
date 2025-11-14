export type TierSlug = 'starter' | 'pro' | 'business';

export interface EntitlementConfig {
  limits?: { recipes?: number; ingredients?: number };
  features: Record<string, boolean>;
}

export const TIER_TO_ENTITLEMENTS: Record<TierSlug, EntitlementConfig> = {
  starter: { features: { cogs: true, recipes: true, analytics: true } }, // Enabled for development/testing
  pro: { features: { cogs: true, recipes: true, analytics: true } },
  business: { features: { cogs: true, recipes: true, analytics: true } },
};
