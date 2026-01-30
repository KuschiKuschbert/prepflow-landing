import { ApiErrorHandler } from '@/lib/api-error-handler';
import { requireAuth } from '@/lib/auth0-api-helpers';
import { clearTierCache } from '@/lib/feature-gate';
import { logger } from '@/lib/logger';
import { getStripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import {
  getSubscriptionIdFromDb,
  reactivateStripeSubscription,
  updateUserSubscriptionInDb,
} from './helpers';

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

    if (!userEmail) {
      return NextResponse.json(
        ApiErrorHandler.createError('User email required', 'UNAUTHORIZED', 401),
        { status: 401 },
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    // 1. Get Subscription ID
    const subscriptionId = await getSubscriptionIdFromDb(userEmail, supabaseAdmin);
    if (!subscriptionId) {
      return NextResponse.json(
        ApiErrorHandler.createError('No subscription found', 'SUBSCRIPTION_NOT_FOUND', 404),
        { status: 404 },
      );
    }

    // 2. Reactivate in Stripe
    const subscription = await reactivateStripeSubscription(subscriptionId, stripe);

    // 3. Update DB
    await updateUserSubscriptionInDb(userEmail, subscription, supabaseAdmin);

    // 4. Cache Clear
    clearTierCache(userEmail);

    return NextResponse.json({
      success: true,
      message: 'Subscription reactivated',
      subscription: {
        id: subscription.id,
        status: subscription.status,
        expires_at: new Date(
          (subscription as unknown as { current_period_end: number }).current_period_end * 1000,
        ).toISOString(),
      },
    });
  } catch (error) {
    if (error instanceof NextResponse) return error;
    // Handle custom errors thrown by helpers (if they return formatted objects, check structure)
    // But helpers currently throw Error or ApiErrorHandler objects.
    // Let's safe check:
    const err = error as Record<string, unknown>;
    if (err.statusCode && typeof err.statusCode === 'number' && err.code) {
      return NextResponse.json(err, { status: err.statusCode });
    }

    logger.error('[Billing API] Reactivation error:', error);
    return NextResponse.json(
      ApiErrorHandler.createError('Failed to reactivate subscription', 'STRIPE_ERROR', 500),
      { status: 500 },
    );
  }
}
