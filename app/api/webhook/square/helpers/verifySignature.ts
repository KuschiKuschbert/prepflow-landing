import { logger } from '@/lib/logger';
import crypto from 'crypto';

/**
 * Verify Square webhook signature
 * Square uses HMAC-SHA256 for signature verification
 *
 * @param {string} payload - Raw webhook payload
 * @param {string} signature - Signature from x-square-signature header
 * @param {string} webhookSecret - Webhook secret for verification
 * @returns {boolean} True if signature is valid
 */
export function verifyWebhookSignature(
  payload: string,
  signature: string,
  webhookSecret: string,
): boolean {
  try {
    const hmac = crypto.createHmac('sha256', webhookSecret);
    hmac.update(payload);
    const calculatedSignature = hmac.digest('base64');

    // Square sends signature in format: "sha256=<signature>"
    const receivedSignature = signature.replace('sha256=', '');

    // Use constant-time comparison to prevent timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(calculatedSignature),
      Buffer.from(receivedSignature),
    );
  } catch (error: any) {
    logger.error('[Square Webhook] Error verifying signature:', {
      error: error.message,
    });
    return false;
  }
}

