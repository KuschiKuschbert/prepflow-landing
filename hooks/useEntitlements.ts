'use client';

import { useEffect, useState } from 'react';
import type { TierSlug } from '@/lib/tier-config';
import { logger } from '@/lib/logger';

export interface UserEntitlements {
  tier: TierSlug;
  features: Record<string, boolean>;
  limits?: {
    recipes?: number;
    ingredients?: number;
  };
}

export interface SubscriptionData {
  subscription: {
    tier: TierSlug;
    status: string;
    expires_at: string | null;
    created_at: string | null;
  };
  entitlements: UserEntitlements;
  usage: {
    ingredients: number;
    recipes: number;
    dishes: number;
  };
}

/**
 * Client-side hook for checking user entitlements and subscription status.
 * Fetches from /api/user/subscription and provides convenient accessors.
 */
export function useEntitlements() {
  const [entitlements, setEntitlements] = useState<UserEntitlements | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionData['subscription'] | null>(null);
  const [usage, setUsage] = useState<SubscriptionData['usage'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEntitlements = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/user/subscription');
      if (!response.ok) {
        throw new Error('Failed to fetch subscription');
      }
      const data: SubscriptionData = await response.json();
      setEntitlements(data.entitlements);
      setSubscription(data.subscription);
      setUsage(data.usage);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch entitlements';
      setError(errorMessage);
      logger.error('[useEntitlements] Error fetching entitlements:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntitlements();
  }, []);

  const hasFeature = (featureKey: string): boolean => {
    if (!entitlements) return false;
    return Boolean(entitlements.features[featureKey]);
  };

  const tier: TierSlug = subscription?.tier || 'starter';

  const canUpgrade = tier !== 'business';

  const getUpgradeTier = (): TierSlug | null => {
    if (tier === 'starter') return 'pro';
    if (tier === 'pro') return 'business';
    return null;
  };

  const checkLimit = (
    resourceType: 'recipes' | 'ingredients',
  ): { used: number; limit: number | null; atLimit: boolean } => {
    if (!usage || !entitlements?.limits) {
      return { used: 0, limit: null, atLimit: false };
    }

    const limit = entitlements.limits[resourceType];
    const used = resourceType === 'recipes' ? usage.recipes : usage.ingredients;

    return {
      used,
      limit: limit ?? null,
      atLimit: limit !== undefined && limit !== null && used >= limit,
    };
  };

  return {
    entitlements,
    subscription,
    usage,
    loading,
    error,
    tier,
    hasFeature,
    canUpgrade,
    getUpgradeTier,
    checkLimit,
    refresh: fetchEntitlements,
  };
}




