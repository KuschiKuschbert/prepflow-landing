'use client';

import type { TierSlug } from '@/lib/tier-config';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import {
  checkLimitHelper,
  getUpgradeTierHelper,
  hasFeatureHelper,
} from './useEntitlements/helpers/entitlementHelpers';
import { fetchEntitlementsHelper } from './useEntitlements/helpers/fetchEntitlements';
import type { SubscriptionData, UserEntitlements } from './useEntitlements/types';

export type { SubscriptionData, UserEntitlements };

/**
 * Client-side hook for checking user entitlements and subscription status.
 * Fetches from /api/user/subscription and provides convenient accessors.
 */
export function useEntitlements() {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['entitlements'],
    queryFn: async () => {
      const result: {
        entitlements: UserEntitlements | null;
        subscription: SubscriptionData['subscription'] | null;
        usage: SubscriptionData['usage'] | null;
      } = {
        entitlements: null,
        subscription: null,
        usage: null,
      };

      await fetchEntitlementsHelper(
        e => {
          result.entitlements = e;
        },
        s => {
          result.subscription = s;
        },
        u => {
          result.usage = u;
        },
        () => {}, // setLoading
        () => {}, // setError
      );

      return result;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: false,
  });

  const entitlements = data?.entitlements || null;
  const subscription = data?.subscription || null;
  const usage = data?.usage || null;

  const tier: TierSlug = subscription?.tier || 'starter';

  const hasFeature = useCallback(
    (featureKey: string) => hasFeatureHelper(entitlements, featureKey),
    [entitlements],
  );

  const canUpgrade = tier !== 'business';

  const getUpgradeTier = useCallback(() => getUpgradeTierHelper(tier), [tier]);

  const checkLimit = useCallback(
    (resourceType: 'recipes' | 'ingredients') =>
      checkLimitHelper(usage, entitlements, resourceType),
    [usage, entitlements],
  );

  const refresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['entitlements'] });
  }, [queryClient]);

  return useMemo(
    () => ({
      entitlements,
      subscription,
      usage,
      loading: isLoading,
      error: error instanceof Error ? error.message : null,
      tier,
      hasFeature,
      canUpgrade,
      getUpgradeTier,
      checkLimit,
      refresh,
    }),
    [
      entitlements,
      subscription,
      usage,
      isLoading,
      error,
      tier,
      hasFeature,
      canUpgrade,
      getUpgradeTier,
      checkLimit,
      refresh,
    ],
  );
}
