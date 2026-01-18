import { ApiErrorHandler } from '@/lib/api-error-handler';
import { requireAuth } from '@/lib/auth0-api-helpers';
import { getOrCreateCustomerId } from '@/lib/billing';
import { logger } from '@/lib/logger';
import { getStripe } from '@/lib/stripe';
import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/billing/create-portal-session
 * Create Stripe customer portal session for billing management
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
    const email = user.email;

    const customerId = await getOrCreateCustomerId(email);
    if (!customerId) {
      return NextResponse.json(
        ApiErrorHandler.createError('Unable to resolve customer', 'CUSTOMER_RESOLUTION_ERROR', 500),
        { status: 500 },
      );
    }

    const origin = req.headers.get('origin') || process.env.AUTH0_BASE_URL || 'http://localhost:3000';
    const portal = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${origin}/webapp/settings/billing`,
    });

    return NextResponse.json({ url: portal.url });
  } catch (error) {
    logger.error('[Billing API] Portal session error:', error);
    return NextResponse.json(
      ApiErrorHandler.createError('Failed to create portal session', 'STRIPE_ERROR', 500),
      { status: 500 },
    );
  }
}
