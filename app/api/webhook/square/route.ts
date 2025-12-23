/**
 * Square Webhook Handler
 * Handles webhook events from Square with signature verification and idempotency
 *
 * 📚 Complete Reference: See `docs/SQUARE_API_REFERENCE.md` (API Endpoints, Webhook Configuration sections) for
 * comprehensive webhook setup, signature verification, and event handling documentation.
 */

import { logger } from '@/lib/logger';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookSignature } from './helpers/verifySignature';
import { isWebhookEventProcessed } from './helpers/checkIdempotency';
import { markWebhookEventProcessed } from './helpers/markProcessed';
import { getWebhookSecret } from './helpers/getWebhookSecret';
import { getUserIdFromEvent } from './helpers/getUserId';
import { routeWebhookEvent } from './helpers/routeEvent';


export async function POST(req: NextRequest) {
  const startTime = Date.now();
  let eventId: string | null = null;
  let userId: string | null = null;

  try {
    // Get raw body for signature verification
    const rawBody = await req.text();
    const signature = req.headers.get('x-square-signature');

    if (!signature) {
      logger.error('[Square Webhook] Missing signature header');
      return NextResponse.json(ApiErrorHandler.createError('Missing signature', 'SERVER_ERROR', 400), { status: 400 });
    }

    // Parse event to get event_id and location_id
    let event: any;
    try {
      event = JSON.parse(rawBody);
    } catch (error: any) {
      logger.error('[Square Webhook] Invalid JSON payload:', {
        error: error.message,
      });
      return NextResponse.json(ApiErrorHandler.createError('Invalid JSON', 'SERVER_ERROR', 400), { status: 400 });
    }

    eventId = event.event_id || event.id || `square-${Date.now()}`;

    // Extract user ID from event
    userId = await getUserIdFromEvent(event);

    if (!userId) {
      logger.warn('[Square Webhook] Could not determine user ID from event');
      // Return 200 to prevent Square from retrying (this is a configuration issue)
      return NextResponse.json(
        { error: 'User not found for location' },
        { status: 200 },
      );
    }

    // Get webhook secret for user
    const webhookSecret = await getWebhookSecret(userId);

    if (!webhookSecret) {
      logger.error('[Square Webhook] Missing webhook secret', {
        userId,
        hasEnvSecret: !!process.env.SQUARE_WEBHOOK_SECRET,
      });
      return NextResponse.json(ApiErrorHandler.createError('Missing webhook secret', 'SERVER_ERROR', 501), { status: 501 });
    }

    // Verify webhook signature
    const isValidSignature = verifyWebhookSignature(rawBody, signature, webhookSecret);

    if (!isValidSignature) {
      logger.error('[Square Webhook] Invalid signature:', {
        eventId,
        userId,
      });
      return NextResponse.json(ApiErrorHandler.createError('Invalid signature', 'SERVER_ERROR', 400), { status: 400 });
    }

    // Check idempotency - skip if already processed
    const alreadyProcessed = await isWebhookEventProcessed(eventId, userId);
    if (alreadyProcessed) {
      logger.dev('[Square Webhook] Event already processed, skipping:', {
        eventId,
        type: event.type,
        userId,
      });
      return NextResponse.json({ received: true, type: event.type, skipped: true });
    }

    // Route event to appropriate handler
    await routeWebhookEvent(event, userId);

    const processingTime = Date.now() - startTime;

    // Mark event as processed successfully
    await markWebhookEventProcessed({
      eventId,
      eventType: event.type,
      userId,
      success: true,
      processingTimeMs: processingTime,
      eventData: event.data,
    });

    return NextResponse.json({ received: true, type: event.type });
  } catch (error: any) {
    const processingTime = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : String(error);

    logger.error('[Square Webhook] Error processing webhook:', {
      error: errorMessage,
      eventId,
      userId,
      processingTimeMs: processingTime,
      stack: error.stack,
    });

    // Mark event as processed with error (prevents infinite retries for non-retryable errors)
    if (eventId && userId) {
      await markWebhookEventProcessed({
        eventId,
        eventType: 'unknown',
        userId,
        success: false,
        processingTimeMs: processingTime,
        errorMessage,
        eventData: null,
      });
    }

    // Return 200 to prevent Square from retrying non-retryable errors
    // Only return 500 for retryable errors (database connection issues, etc.)
    const isRetryable =
      errorMessage.includes('connection') ||
      errorMessage.includes('timeout') ||
      errorMessage.includes('ECONNREFUSED');

    return NextResponse.json(
      {
        error: 'Webhook processing failed',
        eventId,
        userId,
        retryable: isRetryable,
      },
      { status: isRetryable ? 500 : 200 },
    );
  }
}
