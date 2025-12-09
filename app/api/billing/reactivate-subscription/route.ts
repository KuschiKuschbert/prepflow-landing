import { ApiErrorHandler } from '@/lib/api-error-handler';
import { authOptions } from '@/lib/auth-options';
import { getStripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { clearTierCache } from '@/lib/feature-gate';
import type { TierSlug } from '@/lib/tier-config';
import type Stripe from 'stripe';

/**
 * POST /api/billing/reactivate-subscription
 * Reactivate a cancelled subscription
 *
 * @param {NextRequest} req - Request object
 * @returns {Promise<NextResponse>} Success response with reactivated subscription details
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
      .select('stripe_subscription_id, subscription_tier, subscription_status')
      .eq('email', userEmail)
      .single();

    if (userError || !userData?.stripe_subscription_id) {
      logger.warn('[Billing API] User has no subscription:', {
        userEmail,
        error: userError?.message,
      });
      return NextResponse.json(
        ApiErrorHandler.createError('No subscription found', 'SUBSCRIPTION_NOT_FOUND', 404),
        { status: 404 },
      );
    }

    const subscriptionId = userData.stripe_subscription_id;

    // Retrieve current subscription from Stripe
    let subscription: Stripe.Subscription;
    try {
      subscription = await stripe.subscriptions.retrieve(subscriptionId);
    } catch (error: any) {
      if (error.code === 'resource_missing') {
        return NextResponse.json(
          ApiErrorHandler.createError(
            'Subscription not found in Stripe',
            'SUBSCRIPTION_NOT_FOUND',
            404,
          ),
          { status: 404 },
        );
      }
      throw error;
    }

    // Check if subscription is cancelled or scheduled for cancellation
    if (subscription.status === 'canceled' && !subscription.cancel_at_period_end) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          'Subscription is permanently cancelled and cannot be reactivated',
          'SUBSCRIPTION_PERMANENTLY_CANCELLED',
          400,
        ),
        { status: 400 },
      );
    }

    // Remove cancel_at_period_end flag if scheduled for cancellation
    if (subscription.cancel_at_period_end) {
      subscription = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: false,
      });
    }

    // If subscription is already active, just update the flag
    if (subscription.status === 'active') {
      const expiresAt = (subscription as any).current_period_end
        ? new Date((subscription as any).current_period_end * 1000)
        : null;

      const currentPeriodStart = (subscription as any).current_period_start
        ? new Date((subscription as any).current_period_start * 1000)
        : null;

      // Update database
      const { error: updateError } = await supabaseAdmin
        .from('users')
        .update({
          subscription_status: 'active',
          subscription_cancel_at_period_end: false,
          subscription_expires: expiresAt?.toISOString() || null,
          subscription_current_period_start: currentPeriodStart?.toISOString() || null,
          updated_at: new Date().toISOString(),
        })
        .eq('email', userEmail);

      if (updateError) {
        logger.error('[Billing API] Failed to update subscription in database:', {
          error: updateError.message,
          userEmail,
        });
      }

      clearTierCache(userEmail);

      logger.dev('[Billing API] Subscription reactivated:', {
        userEmail,
        subscriptionId,
      });

      return NextResponse.json({
        success: true,
        message: 'Subscription reactivated successfully',
        subscription: {
          id: subscription.id,
          status: subscription.status,
          cancel_at_period_end: subscription.cancel_at_period_end,
          current_period_end: (subscription as any).current_period_end,
          expires_at: expiresAt?.toISOString(),
        },
      });
    }

    // If subscription is in another state, return error
    return NextResponse.json(
      ApiErrorHandler.createError(
        `Subscription is in ${subscription.status} state and cannot be reactivated`,
        'SUBSCRIPTION_INVALID_STATE',
        400,
      ),
      { status: 400 },
    );
  } catch (error) {
    logger.error('[Billing API] Failed to reactivate subscription:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      context: { endpoint: '/api/billing/reactivate-subscription' },
    });

    return NextResponse.json(
      ApiErrorHandler.createError(
        process.env.NODE_ENV === 'development'
          ? error instanceof Error
            ? error.message
            : 'Unknown error'
          : 'Failed to reactivate subscription',
        'STRIPE_ERROR',
        500,
      ),
      { status: 500 },
    );
  }
}
