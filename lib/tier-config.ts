export type TierSlug = 'starter' | 'pro' | 'business';

export interface EntitlementConfig {
  limits?: { recipes?: number; ingredients?: number };
  features: Record<string, boolean>;
}

/**
 * Default tier configurations.
 * These are used as fallback when database is unavailable or tier not found in DB.
 * Admin panel can override these via database.
 */
export const TIER_TO_ENTITLEMENTS: Record<TierSlug, EntitlementConfig> = {
  starter: {
    limits: { recipes: 50, ingredients: 200 },
    features: {
      cogs: true,
      recipes: true,
      analytics: true,
      temperature: true,
      cleaning: true,
      compliance: true,
      // Premium features disabled
      ai_specials: false,
      export_csv: false,
      export_pdf: false,
      recipe_sharing: false,
      advanced_analytics: false,
      multi_user: false,
      api_access: false,
    },
  },
  pro: {
    limits: { recipes: undefined, ingredients: undefined }, // Unlimited
    features: {
      cogs: true,
      recipes: true,
      analytics: true,
      temperature: true,
      cleaning: true,
      compliance: true,
      ai_specials: true,
      export_csv: true,
      export_pdf: true,
      recipe_sharing: true,
      advanced_analytics: true,
      // Business features disabled
      multi_user: false,
      api_access: false,
    },
  },
  business: {
    limits: { recipes: undefined, ingredients: undefined }, // Unlimited
    features: {
      cogs: true,
      recipes: true,
      analytics: true,
      temperature: true,
      cleaning: true,
      compliance: true,
      ai_specials: true,
      export_csv: true,
      export_pdf: true,
      recipe_sharing: true,
      advanced_analytics: true,
      multi_user: true,
      api_access: true,
    },
  },
};

/**
 * Get default tier configuration (fallback when DB unavailable).
 */
export function getDefaultTierConfig(tierSlug: TierSlug): EntitlementConfig {
  return TIER_TO_ENTITLEMENTS[tierSlug] || TIER_TO_ENTITLEMENTS.starter;
}

/**
 * Get default feature-to-tier mapping.
 * Maps feature keys to minimum required tier.
 */
export function getDefaultFeatureTierMapping(): Record<string, TierSlug> {
  return {
    cogs: 'starter',
    recipes: 'starter',
    analytics: 'starter',
    temperature: 'starter',
    cleaning: 'starter',
    compliance: 'starter',
    ai_specials: 'pro',
    export_csv: 'pro',
    export_pdf: 'pro',
    recipe_sharing: 'pro',
    advanced_analytics: 'pro',
    multi_user: 'business',
    api_access: 'business',
  };
}
