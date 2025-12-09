/**
 * Tiers & Features Types
 */

import type { TierSlug } from '@/lib/tier-config';

export interface TierConfiguration {
  tier_slug: TierSlug;
  name: string;
  price_monthly: number | null;
  price_yearly: number | null;
  features: Record<string, boolean>;
  limits: {
    recipes?: number;
    ingredients?: number;
  };
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface FeatureMapping {
  feature_key: string;
  required_tier: TierSlug;
  description: string | null;
  is_premium: boolean;
  created_at: string;
  updated_at: string;
}

export type TabType = 'tiers' | 'features';
