import { logger } from '@/lib/logger';
import { getSquareConfig } from '@/lib/square/config';

/**
 * Get webhook secret from user configuration or environment
 *
 * @param {string} userId - User ID
 * @returns {Promise<string | null>} Webhook secret or null if not found
 */
export async function getWebhookSecret(userId: string): Promise<string | null> {
  try {
    const config = await getSquareConfig(userId);
    if (config?.webhook_secret) {
      return config.webhook_secret;
    }

    // Fallback to environment variable (for global webhook secret)
    return process.env.SQUARE_WEBHOOK_SECRET || null;
  } catch (error: any) {
    logger.error('[Square Webhook] Error getting webhook secret:', {
      error: error.message,
      userId,
    });
    return null;
  }
}
