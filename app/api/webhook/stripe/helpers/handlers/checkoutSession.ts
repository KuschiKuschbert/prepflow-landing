import { clearTierCache } from '@/lib/feature-gate';
import { logger } from '@/lib/logger';
import { extractTierFromStripe } from '@/lib/webhook-helpers';
import { subscriptionNotifications } from '@/lib/subscription-notifications';
import type Stripe from 'stripe';
import { getUserEmailFromCheckoutSession } from '../getUserEmail';
import { updateUserSubscription } from '../updateSubscription';

/**
 * Handle checkout.session.completed event
 */
export async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session,
  stripe: Stripe,
): Promise<void> {
  // Stripe best practice: Use expand parameters to reduce API calls
  // Expand line_items and customer to get all needed data in one call
  const expandedSession = await stripe.checkout.sessions.retrieve(session.id, {
    expand: ['line_items', 'customer', 'subscription'],
  });

  // Get user email with fallbacks
  const userEmail = await getUserEmailFromCheckoutSession(expandedSession, stripe);

  if (!userEmail) {
    logger.warn('[Stripe Webhook] Could not find user email for checkout session:', {
      sessionId: session.id,
      customerId: session.customer,
    });
    return;
  }

  // Extract tier from metadata (primary) or price ID (fallback)
  const tier =
    extractTierFromStripe(
      expandedSession.line_items?.data?.[0]?.price?.id as string | undefined,
      expandedSession.metadata || undefined,
    ) || 'starter';

  const subscriptionId = expandedSession.subscription as string | null;

  // Set subscription to active
  await updateUserSubscription(
    userEmail,
    tier,
    'active',
    null,
    subscriptionId || undefined,
    false,
    undefined,
  );
  clearTierCache(userEmail);

  // Send notification
  await subscriptionNotifications.subscriptionActivated(userEmail, tier);

  logger.dev('[Stripe Webhook] Checkout completed:', {
    userEmail,
    tier,
    subscriptionId,
  });
}
