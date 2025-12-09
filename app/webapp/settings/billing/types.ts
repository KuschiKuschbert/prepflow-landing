import type { TierSlug } from '@/lib/tier-config';

export interface SubscriptionData {
  subscription: {
    tier: TierSlug;
    status: string;
    expires_at: string | null;
    created_at: string | null;
    cancel_at_period_end?: boolean;
    current_period_start?: string | null;
  };
  entitlements: {
    tier: TierSlug;
    features: Record<string, boolean>;
    limits?: {
      recipes?: number;
      ingredients?: number;
    };
  };
  usage: {
    ingredients: number;
    recipes: number;
    dishes: number;
  };
}
