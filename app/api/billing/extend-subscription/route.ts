import { ApiErrorHandler } from '@/lib/api-error-handler';
import { authOptions } from '@/lib/auth-options';
import { getStripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { clearTierCache } from '@/lib/feature-gate';
import type Stripe from 'stripe';

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

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        ApiErrorHandler.createError('Authentication required', 'UNAUTHORIZED', 401),
        { status: 401 },
      );
    }

    const body = await req.json().catch(() => ({}));
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
    const userEmail = session.user.email as string;

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
    const currentPeriodEnd = (subscription as any).current_period_end;
    const newPeriodEnd = currentPeriodEnd + months * 30 * 24 * 60 * 60; // Approximate months

    // Update subscription to extend billing period
    const updatedSubscription: Stripe.Subscription = await stripe.subscriptions.update(
      subscriptionId,
      {
        billing_cycle_anchor: newPeriodEnd,
        proration_behavior: 'none', // Don't prorate, just extend
      },
    );

    // Update database with new expiry date
    const newExpiresAt = (updatedSubscription as any).current_period_end
      ? new Date((updatedSubscription as any).current_period_end * 1000)
      : null;

    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({
        subscription_expires: newExpiresAt?.toISOString() || null,
        subscription_current_period_start: (updatedSubscription as any).current_period_start
          ? new Date((updatedSubscription as any).current_period_start * 1000).toISOString()
          : null,
        updated_at: new Date().toISOString(),
      })
      .eq('email', userEmail);

    if (updateError) {
      logger.error('[Billing API] Failed to update subscription in database:', {
        error: updateError.message,
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
        current_period_end: (updatedSubscription as any).current_period_end,
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
