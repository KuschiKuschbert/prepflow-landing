import type { TierSlug } from '@/lib/tier-config';

export const tierNames: Record<TierSlug, string> = {
  starter: 'Starter',
  pro: 'Pro',
  business: 'Business',
};

export const tierDescriptions: Record<TierSlug, string> = {
  starter: 'Perfect for getting started',
  pro: 'For growing businesses',
  business: 'Enterprise features and support',
};
