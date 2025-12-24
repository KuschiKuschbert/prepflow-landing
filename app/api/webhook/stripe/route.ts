import { logger } from '@/lib/logger';
import { getStripe } from '@/lib/stripe';
import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { handleCheckoutSessionCompleted } from './helpers/handlers/checkoutSession';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import {
  handleInvoicePaymentFailed,
  handleInvoicePaymentSucceeded,
} from './helpers/handlers/invoice';
import {
  handleSubscriptionCreated,
  handleSubscriptionDeleted,
  handleSubscriptionUpdated,
} from './helpers/handlers/subscription';
import {
  getWebhookSecret,
  isWebhookEventProcessed,
  markWebhookEventProcessed,
} from './helpers/webhookEvents';

export async function POST(req: Request) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(ApiErrorHandler.createError('Stripe not configured', 'ERROR', 501), {
      status: 501,
    });
  }
  const sig = req.headers.get('stripe-signature');
  if (!sig)
    return NextResponse.json(ApiErrorHandler.createError('Missing signature', 'BAD_REQUEST', 400), {
      status: 400,
    });

  // Get environment-specific webhook secret (Stripe best practice)
  const webhookSecret = getWebhookSecret();
  if (!webhookSecret) {
    logger.error('[Stripe Webhook] Missing webhook secret', {
      nodeEnv: process.env.NODE_ENV,
      hasDevSecret: !!process.env.STRIPE_WEBHOOK_SECRET_DEV,
      hasProdSecret: !!process.env.STRIPE_WEBHOOK_SECRET_PROD,
      hasFallbackSecret: !!process.env.STRIPE_WEBHOOK_SECRET,
    });
    return NextResponse.json(ApiErrorHandler.createError('Missing webhook secret', 'ERROR', 501), {
      status: 501,
    });
  }

  const rawBody = await req.text();
  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    logger.error('[Stripe Webhook] Invalid signature:', {
      error: err instanceof Error ? err.message : String(err),
      nodeEnv: process.env.NODE_ENV,
    });
    return NextResponse.json(ApiErrorHandler.createError('Invalid signature', 'BAD_REQUEST', 400), {
      status: 400,
    });
  }

  const eventId = event.id;
  const startTime = Date.now();

  // Check idempotency - skip if already processed
  const alreadyProcessed = await isWebhookEventProcessed(eventId);
  if (alreadyProcessed) {
    logger.dev('[Stripe Webhook] Event already processed, skipping:', {
      eventId,
      type: event.type,
    });
    return NextResponse.json({ received: true, type: event.type, skipped: true });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionCompleted(session, stripe);
        break;
      }

      case 'customer.subscription.created': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionCreated(subscription, stripe);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription, stripe);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription, stripe);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentSucceeded(invoice, stripe);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentFailed(invoice, stripe);
        break;
      }

      default:
        logger.dev('[Stripe Webhook] Unhandled event type:', event.type);
    }

    const processingTime = Date.now() - startTime;

    // Mark event as processed successfully
    await markWebhookEventProcessed(
      eventId,
      event.type,
      true,
      processingTime,
      undefined,
      event.data,
    );

    return NextResponse.json({ received: true, type: event.type });
  } catch (error) {
    const processingTime = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : String(error);

    logger.error('[Stripe Webhook] Error processing webhook:', {
      error: errorMessage,
      type: event.type,
      eventId,
      processingTimeMs: processingTime,
    });

    // Mark event as processed with error (prevents infinite retries for non-retryable errors)
    await markWebhookEventProcessed(
      eventId,
      event.type,
      false,
      processingTime,
      errorMessage,
      event.data,
    );

    // Return 200 to prevent Stripe from retrying non-retryable errors
    // Only return 500 for retryable errors (database connection issues, etc.)
    const isRetryable = errorMessage.includes('connection') || errorMessage.includes('timeout');
    return NextResponse.json(
      {
        error: 'Webhook processing failed',
        type: event.type,
        eventId,
        retryable: isRetryable,
      },
      { status: isRetryable ? 500 : 200 },
    );
  }
}
