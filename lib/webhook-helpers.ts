import type { TierSlug } from './tier-config';

/**
 * Extract tier from Stripe price ID or subscription metadata.
 * Used by webhook handlers and sync utilities.
 *
 * @param {string} [priceId] - Stripe price ID
 * @param {Record<string, string>} [metadata] - Subscription or checkout metadata
 * @returns {TierSlug | null} Extracted tier or null if not found
 */
export function extractTierFromStripe(
  priceId?: string,
  metadata?: Record<string, string>,
): TierSlug | null {
  // Check metadata first
  if (metadata?.tier) {
    const tier = metadata.tier.toLowerCase();
    if (tier === 'starter' || tier === 'pro' || tier === 'business') {
      return tier as TierSlug;
    }
  }

  // Check price ID against environment variables
  if (priceId) {
    if (priceId === process.env.STRIPE_PRICE_STARTER_MONTHLY) return 'starter';
    if (priceId === process.env.STRIPE_PRICE_PRO_MONTHLY) return 'pro';
    if (priceId === process.env.STRIPE_PRICE_BUSINESS_MONTHLY) return 'business';
  }

  return null;
}




