import { ApiErrorHandler } from '@/lib/api-error-handler';
import { requireAuth } from '@/lib/auth0-api-helpers';
import { clearTierCache } from '@/lib/feature-gate';
import { logger } from '@/lib/logger';
import { getStripe } from '@/lib/stripe';
import { NextRequest, NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { z } from 'zod';
import { cancelStripeSubscription } from './helpers/cancelStripeSubscription';
import { getCancellationMessage } from './helpers/getCancellationMessage';
import { getUserSubscription } from './helpers/getUserSubscription';
import { scheduleAccountDeletionIfNeeded } from './helpers/scheduleDeletion';
import { updateSubscriptionInDatabase } from './helpers/updateDatabase';

const cancelSubscriptionSchema = z.object({
  immediate: z.boolean().optional().default(false),
});

/**
 * POST /api/billing/cancel-subscription
 * Cancel subscription (immediate or at period end)
 *
 * @param {NextRequest} req - Request object
 * @param {Object} req.body - Request body
 * @param {boolean} [req.body.immediate=false] - If true, cancel immediately; if false, cancel at period end
 * @returns {Promise<NextResponse>} Success response with cancellation details
 */
export async function POST(req: NextRequest) {
  try {
    const stripe = getStripe();
    if (!stripe) {
      return NextResponse.json(
        ApiErrorHandler.createError('Stripe not configured', 'STRIPE_NOT_CONFIGURED', 501),
        { status: 501 },
      );
    }

    const user = await requireAuth(req);
    if (!user?.email) {
      return NextResponse.json(
        ApiErrorHandler.createError('Authentication required', 'UNAUTHORIZED', 401),
        { status: 401 },
      );
    }

    let body;
    try {
      body = await req.json();
    } catch (jsonError) {
      logger.warn('[Billing API] Failed to parse request JSON:', {
        error: jsonError instanceof Error ? jsonError.message : String(jsonError),
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Invalid JSON body', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }
    const validationResult = cancelSubscriptionSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          validationResult.error.issues[0]?.message || 'Invalid request body',
          'VALIDATION_ERROR',
          400,
        ),
        { status: 400 },
      );
    }

    const { immediate } = validationResult.data;
    const userEmail = user.email as string;

    // Get user's subscription ID from database
    const userSubscriptionResult = await getUserSubscription(userEmail);
    if (userSubscriptionResult instanceof NextResponse) {
      return userSubscriptionResult;
    }

    const subscriptionId = userSubscriptionResult.stripe_subscription_id;

    // Retrieve current subscription from Stripe
    const subscription: Stripe.Subscription = await stripe.subscriptions.retrieve(subscriptionId);

    if (!subscription || subscription.status === 'canceled') {
      return NextResponse.json(
        ApiErrorHandler.createError(
          'Subscription is already cancelled',
          'SUBSCRIPTION_ALREADY_CANCELLED',
          400,
        ),
        { status: 400 },
      );
    }

    const { updatedSubscription, cancelAtPeriodEnd, expiresAt } = await cancelStripeSubscription({
      stripe,
      subscriptionId,
      subscription,
      immediate,
    });

    // Update database
    await updateSubscriptionInDatabase({
      userEmail,
      immediate,
      cancelAtPeriodEnd,
      expiresAt,
    });

    clearTierCache(userEmail);

    // Check if user is EU customer and schedule deletion if needed
    let isEU = false;
    try {
      const { getUserEUStatus } = await import('@/lib/geo/eu-detection');
      isEU = await getUserEUStatus(userEmail, req);
    } catch (err) {
      logger.warn('[Billing API] Failed to detect EU status:', {
        error: err instanceof Error ? err.message : String(err),
        userEmail,
      });
    }

    await scheduleAccountDeletionIfNeeded({
      userEmail,
      subscriptionId,
      immediate,
      request: req,
    });

    logger.dev('[Billing API] Subscription cancelled:', {
      userEmail,
      subscriptionId,
      immediate,
      cancelAtPeriodEnd,
      expiresAt: expiresAt?.toISOString(),
      isEU,
    });

    const cancellationMessage = getCancellationMessage(isEU, immediate);

    return NextResponse.json({
      success: true,
      message: cancellationMessage,
      isEU,
      subscription: {
        id: updatedSubscription.id,
        status: updatedSubscription.status,
        cancel_at_period_end: updatedSubscription.cancel_at_period_end,
        current_period_end: (updatedSubscription as unknown as { current_period_end: number }).current_period_end,
        expires_at: expiresAt?.toISOString(),
      },
    });
  } catch (error) {
    logger.error('[Billing API] Failed to cancel subscription:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      context: { endpoint: '/api/billing/cancel-subscription' },
    });

    return NextResponse.json(
      ApiErrorHandler.createError(
        process.env.NODE_ENV === 'development'
          ? error instanceof Error
            ? error.message
            : 'Unknown error'
          : 'Failed to cancel subscription',
        'STRIPE_ERROR',
        500,
      ),
      { status: 500 },
    );
  }
}
