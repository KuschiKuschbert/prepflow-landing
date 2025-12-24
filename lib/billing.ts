import { getStripe } from './stripe';
import { logger } from './logger';
import { getCachedCustomerId } from './billing/helpers/getCachedCustomerId';
import { searchCustomerByEmail } from './billing/helpers/searchCustomerByEmail';
import { createStripeCustomer } from './billing/helpers/createStripeCustomer';

/**
 * Get or create Stripe customer ID for a user email
 * Stripe best practice: Use email as primary identifier, cache customer ID in database
 *
 * @param userEmail - User email address
 * @returns Stripe customer ID or null if Stripe is not configured
 */
export async function getOrCreateCustomerId(userEmail: string): Promise<string | null> {
  const stripe = getStripe();
  if (!stripe) {
    logger.warn('[Billing] Stripe not configured, cannot get/create customer');
    return null;
  }

  if (!userEmail) {
    logger.warn('[Billing] No email provided, cannot get/create customer');
    return null;
  }

  // Stripe best practice: Check database cache first (reduces API calls)
  const cachedId = await getCachedCustomerId(userEmail);
  if (cachedId) {
    return cachedId;
  }

  // Stripe best practice: Search by email (handles case where DB cache is missing)
  const searchedId = await searchCustomerByEmail(userEmail);
  if (searchedId) {
    return searchedId;
  }

  // Stripe best practice: Create new customer if not found
  return await createStripeCustomer(userEmail);
}

export function resolvePriceIdFromTier(tier: string | undefined): string | null {
  switch ((tier || '').toLowerCase()) {
    case 'starter':
      return process.env.STRIPE_PRICE_STARTER_MONTHLY || null;
    case 'pro':
      return process.env.STRIPE_PRICE_PRO_MONTHLY || null;
    case 'business':
      return process.env.STRIPE_PRICE_BUSINESS_MONTHLY || null;
    default:
      return null;
  }
}
