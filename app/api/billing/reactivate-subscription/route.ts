import { ApiErrorHandler } from '@/lib/api-error-handler';
import { requireAuth } from '@/lib/auth0-api-helpers';
import { clearTierCache } from '@/lib/feature-gate';
import { logger } from '@/lib/logger';
import { getStripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import type Stripe from 'stripe';

/**
 * POST /api/billing/reactivate-subscription
 * Reactivate a cancelled subscription
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

    const userEmail = user.email as string;
    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('stripe_subscription_id')
      .eq('email', userEmail)
      .single();

    if (userError || !userData?.stripe_subscription_id) {
      return NextResponse.json(
        ApiErrorHandler.createError('No subscription found', 'SUBSCRIPTION_NOT_FOUND', 404),
        { status: 404 },
      );
    }

    const subscriptionId = userData.stripe_subscription_id;
    let subscription: Stripe.Subscription;

    try {
      subscription = await stripe.subscriptions.retrieve(subscriptionId);
    } catch (error: unknown) {
      if ((error as { code?: string })?.code === 'resource_missing') {
        return NextResponse.json(
          ApiErrorHandler.createError(
            'Subscription missing in Stripe',
            'SUBSCRIPTION_NOT_FOUND',
            404,
          ),
          { status: 404 },
        );
      }
      throw error;
    }

    if (subscription.status === 'canceled' && !subscription.cancel_at_period_end) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          'Cannot reactivate permanently cancelled sub',
          'BAD_REQUEST',
          400,
        ),
        { status: 400 },
      );
    }

    if (subscription.cancel_at_period_end) {
      subscription = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: false,
      });
    }

    if (subscription.status !== 'active') {
      return NextResponse.json(
        ApiErrorHandler.createError(
          `Cannot reactivate sub in ${subscription.status} state`,
          'BAD_REQUEST',
          400,
        ),
        { status: 400 },
      );
    }

    const activeSub = subscription as unknown as Stripe.Subscription & {
      current_period_end: number;
      current_period_start: number;
    };
    const expiresAt = activeSub.current_period_end
      ? new Date(activeSub.current_period_end * 1000)
      : null;
    const currentPeriodStart = activeSub.current_period_start
      ? new Date(activeSub.current_period_start * 1000)
      : null;

    await supabaseAdmin
      .from('users')
      .update({
        subscription_status: 'active',
        subscription_cancel_at_period_end: false,
        subscription_expires: expiresAt?.toISOString() || null,
        subscription_current_period_start: currentPeriodStart?.toISOString() || null,
      })
      .eq('email', userEmail);

    clearTierCache(userEmail);

    return NextResponse.json({
      success: true,
      message: 'Subscription reactivated',
      subscription: {
        id: subscription.id,
        status: subscription.status,
        expires_at: expiresAt?.toISOString(),
      },
    });
  } catch (error) {
    logger.error('[Billing API] Reactivation error:', error);
    return NextResponse.json(
      ApiErrorHandler.createError('Failed to reactivate subscription', 'STRIPE_ERROR', 500),
      { status: 500 },
    );
  }
}
