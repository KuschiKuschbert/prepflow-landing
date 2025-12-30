import { ApiErrorHandler } from '@/lib/api-error-handler';
import { requireAuth } from '@/lib/auth0-api-helpers';
import { logger } from '@/lib/logger';
import { getStripe } from '@/lib/stripe';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

    const checkoutSessionSchema = z
  .object({
    priceId: z.string().optional(),
    tier: z.enum(['starter', 'pro', 'business', 'curbos', 'bundle']).optional(),
  })
  .refine(data => data.priceId || data.tier, {
    message: 'Either priceId or tier must be provided',
  });

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

    let body = {};
    try {
      body = await req.json();
    } catch (err) {
      logger.warn('[Billing Checkout Session API] Failed to parse request body:', {
        error: err instanceof Error ? err.message : String(err),
      });
    }
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

    // Helper to resolve price ID
    const resolvePriceId = (t: string | undefined): string | null => {
         if (!t) return null;
         if (t === 'starter') return process.env.STRIPE_PRICE_STARTER_MONTHLY || null;
         if (t === 'pro') return process.env.STRIPE_PRICE_PRO_MONTHLY || null;
         if (t === 'business') return process.env.STRIPE_PRICE_BUSINESS_MONTHLY || null;
         if (t === 'curbos') return process.env.STRIPE_PRICE_CURBOS_MONTHLY || null;
         if (t === 'bundle') return process.env.STRIPE_PRICE_BUNDLE_MONTHLY || null;
         return null;
    };

    const priceId: string | null = validatedPriceId || resolvePriceId(tier);

    if (!priceId) {
      return NextResponse.json(
        ApiErrorHandler.createError('Missing priceId or tier configuration', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    // ... customer resolution ...

    // Determine tier from priceId or provided tier
    // Map CurbOS/Bundle prices to 'business' tier for entitlements
    const determinedTier =
      (() => {
        // Explicit tier overrides
        if (tier === 'curbos' || tier === 'bundle') return 'business';
        if (tier) return tier;

        // Price ID lookups
        if (priceId === process.env.STRIPE_PRICE_STARTER_MONTHLY) return 'starter';
        if (priceId === process.env.STRIPE_PRICE_PRO_MONTHLY) return 'pro';
        if (priceId === process.env.STRIPE_PRICE_BUSINESS_MONTHLY) return 'business';
        if (priceId === process.env.STRIPE_PRICE_CURBOS_MONTHLY) return 'business';
        if (priceId === process.env.STRIPE_PRICE_BUNDLE_MONTHLY) return 'business';
        return null;
      })();

    const origin =
      req.headers.get('origin') || process.env.AUTH0_BASE_URL || 'http://localhost:3000';

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
        user_email: email,
        created_by: 'checkout_api',
      },
      subscription_data: {
        // Stripe best practice: Include metadata in subscription for webhook events
        metadata: {
          tier: determinedTier || 'starter',
          user_email: email,
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
