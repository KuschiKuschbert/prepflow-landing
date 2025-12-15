/**
 * Types for useEntitlements hook.
 */
import type { TierSlug } from '@/lib/tier-config';

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
