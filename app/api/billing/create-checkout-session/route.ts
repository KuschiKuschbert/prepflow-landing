import { ApiErrorHandler } from '@/lib/api-error-handler';
import { authOptions } from '@/lib/auth-options';
import { getOrCreateCustomerId, resolvePriceIdFromTier } from '@/lib/billing';
import { logger } from '@/lib/logger';
import { getStripe } from '@/lib/stripe';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const checkoutSessionSchema = z
  .object({
    priceId: z.string().optional(),
    tier: z.enum(['starter', 'pro', 'business']).optional(),
  })
  .refine(data => data.priceId || data.tier, {
    message: 'Either priceId or tier must be provided',
  });

/**
 * POST /api/billing/create-checkout-session
 * Create Stripe checkout session for subscription
 *
 * @param {NextRequest} req - Request object
 * @param {Object} req.body - Request body (validated against checkoutSessionSchema)
 * @param {string} [req.body.priceId] - Stripe price ID
 * @param {'starter' | 'pro' | 'enterprise'} [req.body.tier] - Subscription tier
 * @returns {Promise<NextResponse>} Checkout session URL
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
    const validationResult = checkoutSessionSchema.safeParse(body);

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

    const { priceId: validatedPriceId, tier } = validationResult.data;
    const priceId: string | null = validatedPriceId || resolvePriceIdFromTier(tier);
    if (!priceId) {
      return NextResponse.json(
        ApiErrorHandler.createError('Missing priceId or tier', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    const customerId = await getOrCreateCustomerId(session.user.email as string);
    if (!customerId) {
      logger.error('[Billing API] Unable to resolve customer', {
        context: { endpoint: '/api/billing/create-checkout-session', email: session.user.email },
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Unable to resolve customer', 'CUSTOMER_RESOLUTION_ERROR', 500),
        { status: 500 },
      );
    }

    // Determine tier from priceId or provided tier
    const determinedTier =
      tier ||
      (() => {
        if (priceId === process.env.STRIPE_PRICE_STARTER_MONTHLY) return 'starter';
        if (priceId === process.env.STRIPE_PRICE_PRO_MONTHLY) return 'pro';
        if (priceId === process.env.STRIPE_PRICE_BUSINESS_MONTHLY) return 'business';
        return null;
      })();

    const origin = req.headers.get('origin') || process.env.NEXTAUTH_URL || 'http://localhost:3000';

    // Stripe best practice: Create checkout session with proper metadata
    // Metadata is used by webhook handler to identify user and tier
    const checkout = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/webapp/settings/billing?status=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/webapp/settings/billing?status=cancelled`,
      payment_method_collection: 'always',
      allow_promotion_codes: true,
      // Stripe best practice: Include metadata for webhook processing
      metadata: {
        tier: determinedTier || 'starter',
        user_email: session.user.email as string,
        created_by: 'checkout_api',
      },
      subscription_data: {
        // Stripe best practice: Include metadata in subscription for webhook events
        metadata: {
          tier: determinedTier || 'starter',
          user_email: session.user.email as string,
        },
      },
      // Stripe best practice: Enable automatic tax if configured
      automatic_tax: {
        enabled: false, // Set to true if Stripe Tax is configured
      },
    });

    return NextResponse.json({ url: checkout.url });
  } catch (error) {
    logger.error('[Billing API] Failed to create checkout session:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      context: { endpoint: '/api/billing/create-checkout-session' },
    });

    return NextResponse.json(
      ApiErrorHandler.createError(
        process.env.NODE_ENV === 'development'
          ? error instanceof Error
            ? error.message
            : 'Unknown error'
          : 'Failed to create checkout session',
        'STRIPE_ERROR',
        500,
      ),
      { status: 500 },
    );
  }
}
