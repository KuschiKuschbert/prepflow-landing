import { getStripe } from '@/lib/stripe';
import { logger } from '@/lib/logger';
import { upsertCustomerMapping } from './upsertCustomerMapping';

/**
 * Create a new Stripe customer.
 *
 * @param {string} userEmail - User email address
 * @returns {Promise<string | null>} Customer ID if created, null on error
 */
export async function createStripeCustomer(userEmail: string): Promise<string | null> {
  const stripe = getStripe();
  if (!stripe) {
    return null;
  }

  try {
    const created = await stripe.customers.create({ email: userEmail });
    await upsertCustomerMapping(userEmail, created.id);
    logger.dev('[Billing] Created new Stripe customer:', {
      email: userEmail,
      customerId: created.id,
    });
    return created.id;
  } catch (error) {
    logger.error('[Billing] Failed to create Stripe customer:', {
      error: error instanceof Error ? error.message : String(error),
      email: userEmail,
    });
    return null;
  }
}

