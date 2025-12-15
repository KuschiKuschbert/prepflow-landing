/**
 * Fetch entitlements helper.
 */
import { logger } from '@/lib/logger';
import type { SubscriptionData, UserEntitlements } from '../types';

export async function fetchEntitlementsHelper(
  setEntitlements: (entitlements: UserEntitlements | null) => void,
  setSubscription: (subscription: SubscriptionData['subscription'] | null) => void,
  setUsage: (usage: SubscriptionData['usage'] | null) => void,
  setLoading: (loading: boolean) => void,
  setError: (error: string | null) => void,
): Promise<void> {
  try {
    setLoading(true);
    setError(null);
    const response = await fetch('/api/user/subscription');
    if (!response.ok) throw new Error('Failed to fetch subscription');
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
}
