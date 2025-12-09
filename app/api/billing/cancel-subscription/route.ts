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

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        ApiErrorHandler.createError('Authentication required', 'UNAUTHORIZED', 401),
        { status: 401 },
      );
    }

    const body = await req.json().catch(() => ({}));
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
      .select('stripe_subscription_id, subscription_tier, subscription_expires')
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
          'Subscription is already cancelled',
          'SUBSCRIPTION_ALREADY_CANCELLED',
          400,
        ),
        { status: 400 },
      );
    }

    let updatedSubscription: Stripe.Subscription;
    let cancelAtPeriodEnd = false;
    let expiresAt: Date | null = null;

    if (immediate) {
      // Cancel immediately
      updatedSubscription = await stripe.subscriptions.cancel(subscriptionId);
      expiresAt = null; // Access ends immediately
    } else {
      // Cancel at period end (scheduled cancellation)
      updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
      });
      cancelAtPeriodEnd = true;
      expiresAt = (subscription as any).current_period_end
        ? new Date((subscription as any).current_period_end * 1000)
        : null;
    }

    // Update database
    const updateData: any = {
      subscription_cancel_at_period_end: cancelAtPeriodEnd,
      updated_at: new Date().toISOString(),
    };

    if (immediate) {
      updateData.subscription_status = 'cancelled';
      updateData.subscription_expires = null;
      updateData.subscription_tier = 'starter'; // Downgrade to starter
    } else {
      // Keep status active but mark as scheduled for cancellation
      updateData.subscription_expires = expiresAt?.toISOString() || null;
    }

    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update(updateData)
      .eq('email', userEmail);

    if (updateError) {
      logger.error('[Billing API] Failed to update subscription in database:', {
        error: updateError.message,
        userEmail,
      });
      // Don't fail the request, subscription was cancelled in Stripe
    }

    clearTierCache(userEmail);

    logger.dev('[Billing API] Subscription cancelled:', {
      userEmail,
      subscriptionId,
      immediate,
      cancelAtPeriodEnd,
      expiresAt: expiresAt?.toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: immediate
        ? 'Subscription cancelled immediately'
        : 'Subscription will be cancelled at the end of the billing period',
      subscription: {
        id: updatedSubscription.id,
        status: updatedSubscription.status,
        cancel_at_period_end: updatedSubscription.cancel_at_period_end,
        current_period_end: (updatedSubscription as any).current_period_end,
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
