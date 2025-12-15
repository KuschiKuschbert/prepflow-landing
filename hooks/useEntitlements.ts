'use client';

import { useEffect, useState } from 'react';
import type { TierSlug } from '@/lib/tier-config';
import { fetchEntitlementsHelper } from './useEntitlements/helpers/fetchEntitlements';
import {
  hasFeatureHelper,
  getUpgradeTierHelper,
  checkLimitHelper,
} from './useEntitlements/helpers/entitlementHelpers';
import type { UserEntitlements, SubscriptionData } from './useEntitlements/types';

export type { UserEntitlements, SubscriptionData };

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

  const fetchEntitlements = () =>
    fetchEntitlementsHelper(setEntitlements, setSubscription, setUsage, setLoading, setError);
  useEffect(() => {
    fetchEntitlements();
  }, []);
  const tier: TierSlug = subscription?.tier || 'starter';
  const hasFeature = (featureKey: string) => hasFeatureHelper(entitlements, featureKey);
  const canUpgrade = tier !== 'business';
  const getUpgradeTier = () => getUpgradeTierHelper(tier);
  const checkLimit = (resourceType: 'recipes' | 'ingredients') =>
    checkLimitHelper(usage, entitlements, resourceType);

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
