import { ApiErrorHandler } from '@/lib/api-error-handler';
import { authOptions } from '@/lib/auth-options';
import { getOrCreateCustomerId } from '@/lib/billing';
import { logger } from '@/lib/logger';
import { getStripe } from '@/lib/stripe';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/billing/create-portal-session
 * Create Stripe customer portal session for billing management
 *
 * @param {NextRequest} req - Request object
 * @returns {Promise<NextResponse>} Portal session URL
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

    const customerId = await getOrCreateCustomerId(session.user.email as string);
    if (!customerId) {
      logger.error('[Billing API] Unable to resolve customer', {
        context: { endpoint: '/api/billing/create-portal-session', email: session.user.email },
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Unable to resolve customer', 'CUSTOMER_RESOLUTION_ERROR', 500),
        { status: 500 },
      );
    }

    const origin = req.headers.get('origin') || process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const portal = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${origin}/webapp/settings/billing`,
    });

    return NextResponse.json({ url: portal.url });
  } catch (error) {
    logger.error('[Billing API] Failed to create portal session:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      context: { endpoint: '/api/billing/create-portal-session' },
    });

    return NextResponse.json(
      ApiErrorHandler.createError(
        process.env.NODE_ENV === 'development'
          ? error instanceof Error
            ? error.message
            : 'Unknown error'
          : 'Failed to create portal session',
        'STRIPE_ERROR',
        500,
      ),
      { status: 500 },
    );
  }
}
