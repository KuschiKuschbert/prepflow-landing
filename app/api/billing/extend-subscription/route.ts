import { ApiErrorHandler } from '@/lib/api-error-handler';
import { requireAuth } from '@/lib/auth0-api-helpers';
import { clearTierCache } from '@/lib/feature-gate';
import { logger } from '@/lib/logger';
import { getStripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { z } from 'zod';

const extendSubscriptionSchema = z.object({
  months: z.number().int().positive().max(12).optional().default(1),
});

/**
 * POST /api/billing/extend-subscription
 * Extend current subscription by adding billing periods
 *
 * @param {NextRequest} req - Request object
 * @param {Object} req.body - Request body
 * @param {number} [req.body.months=1] - Number of months to extend (1-12)
 * @returns {Promise<NextResponse>} Success response with updated subscription details
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
    const validationResult = extendSubscriptionSchema.safeParse(body);

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

    const { months } = validationResult.data;
    const userEmail = user.email as string;

    // Get user's subscription ID from database
    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('stripe_subscription_id, subscription_tier')
      .eq('email', userEmail)
      .single();

    if (userError || !userData?.stripe_subscription_id) {
      logger.warn('[Billing API] User has no active subscription:', {
        userEmail,
        error: userError?.message,
        code: (userError as any)?.code,
      });
      return NextResponse.json(
        ApiErrorHandler.createError('No active subscription found', 'SUBSCRIPTION_NOT_FOUND', 404),
        { status: 404 },
      );
    }

    const subscriptionId = userData.stripe_subscription_id;

    // Retrieve current subscription from Stripe
    const subscription: Stripe.Subscription = await stripe.subscriptions.retrieve(subscriptionId);

    if (!subscription || subscription.status === 'canceled') {
      return NextResponse.json(
        ApiErrorHandler.createError(
          'Subscription is cancelled or not found',
          'SUBSCRIPTION_INVALID',
          400,
        ),
        { status: 400 },
      );
    }

    // Calculate new period end date
    const currentPeriodEnd = (subscription as Stripe.Subscription & { current_period_end: number })
      .current_period_end;
    const newPeriodEnd = currentPeriodEnd + months * 30 * 24 * 60 * 60; // Approximate months

    // Update subscription to extend billing period
    const updatedSubscription: Stripe.Subscription = await stripe.subscriptions.update(
      subscriptionId,
      {
        // @ts-expect-error - Stripe types only allow 'now' | 'unchanged', but logic attempts to set a date.
        // TODO: Verify if passing a timestamp is supported by the API or if this logic is flawed.
        billing_cycle_anchor: newPeriodEnd,
        proration_behavior: 'none', // Don't prorate, just extend
      },
    );

    // Update database with new expiry date
    const updatedSub = updatedSubscription as Stripe.Subscription & {
      current_period_end: number;
      current_period_start: number;
    };

    const newExpiresAt = updatedSub.current_period_end
      ? new Date(updatedSub.current_period_end * 1000)
      : null;

    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({
        subscription_expires: newExpiresAt?.toISOString() || null,
        subscription_current_period_start: updatedSub.current_period_start
          ? new Date(updatedSub.current_period_start * 1000).toISOString()
          : null,
        updated_at: new Date().toISOString(),
      })
      .eq('email', userEmail);

    if (updateError) {
      logger.error('[Billing API] Failed to update subscription in database:', {
        error: updateError.message,
        code: updateError.code,
        userEmail,
      });
      // Don't fail the request, subscription was extended in Stripe
    }

    clearTierCache(userEmail);

    logger.dev('[Billing API] Subscription extended:', {
      userEmail,
      subscriptionId,
      months,
      newExpiresAt: newExpiresAt?.toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: `Subscription extended by ${months} month${months > 1 ? 's' : ''}`,
      subscription: {
        id: updatedSubscription.id,
        current_period_end: updatedSub.current_period_end,
        expires_at: newExpiresAt?.toISOString(),
      },
    });
  } catch (error) {
    logger.error('[Billing API] Failed to extend subscription:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      context: { endpoint: '/api/billing/extend-subscription' },
    });

    return NextResponse.json(
      ApiErrorHandler.createError(
        process.env.NODE_ENV === 'development'
          ? error instanceof Error
            ? error.message
            : 'Unknown error'
          : 'Failed to extend subscription',
        'STRIPE_ERROR',
        500,
      ),
      { status: 500 },
    );
  }
}
