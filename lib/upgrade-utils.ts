import type { TierSlug } from './tier-config';

export interface FeatureComparison {
  currentTier: TierSlug;
  targetTier: TierSlug;
  features: {
    name: string;
    currentTierHas: boolean;
    targetTierHas: boolean;
  }[];
}

/**
 * Get upgrade message for a feature that requires higher tier.
 */
export function getUpgradeMessage(
  featureKey: string,
  currentTier: TierSlug,
  requiredTier: TierSlug,
): string {
  const featureNames: Record<string, string> = {
    ai_specials: 'AI Specials Generation',
    export_csv: 'CSV Export',
    export_pdf: 'PDF Export',
    recipe_sharing: 'Recipe Sharing',
    advanced_analytics: 'Advanced Analytics',
    multi_user: 'Multi-User Support',
    api_access: 'API Access',
  };

  const featureName = featureNames[featureKey] || featureKey;
  const tierNames: Record<TierSlug, string> = {
    starter: 'Starter',
    pro: 'Pro',
    business: 'Business',
  };

  return `${featureName} is available in ${tierNames[requiredTier]} tier. Upgrade to unlock this feature.`;
}

/**
 * Get tier comparison showing what features are available in each tier.
 */
export function getTierComparison(currentTier: TierSlug, targetTier: TierSlug): FeatureComparison {
  const allFeatures = [
    { key: 'cogs', name: 'COGS Calculator' },
    { key: 'recipes', name: 'Recipe Management' },
    { key: 'analytics', name: 'Basic Analytics' },
    { key: 'temperature', name: 'Temperature Monitoring' },
    { key: 'cleaning', name: 'Cleaning Management' },
    { key: 'compliance', name: 'Compliance Records' },
    { key: 'ai_specials', name: 'AI Specials Generation' },
    { key: 'export_csv', name: 'CSV Export' },
    { key: 'export_pdf', name: 'PDF Export' },
    { key: 'recipe_sharing', name: 'Recipe Sharing' },
    { key: 'advanced_analytics', name: 'Advanced Analytics' },
    { key: 'multi_user', name: 'Multi-User Support' },
    { key: 'api_access', name: 'API Access' },
  ];

  const tierOrder: TierSlug[] = ['starter', 'pro', 'business'];
  const currentTierIndex = tierOrder.indexOf(currentTier);
  const targetTierIndex = tierOrder.indexOf(targetTier);

  const featureTierMapping: Record<string, TierSlug> = {
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

  const features = allFeatures.map(feature => {
    const requiredTier = featureTierMapping[feature.key] || 'starter';
    const requiredTierIndex = tierOrder.indexOf(requiredTier);

    return {
      name: feature.name,
      currentTierHas: currentTierIndex >= requiredTierIndex,
      targetTierHas: targetTierIndex >= requiredTierIndex,
    };
  });

  return {
    currentTier,
    targetTier,
    features,
  };
}
