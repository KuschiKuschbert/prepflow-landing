/**
 * Send in-app breach notification.
 */
import { logger } from '@/lib/logger';
import { createNotification } from '@/lib/subscription-notifications';
import type { BreachNotificationData } from './sendBreachEmail';

/**
 * Send in-app notification to affected user
 * @param userEmail - User email to notify
 * @param breachData - Breach information
 * @returns Success status
 */
export async function sendBreachInAppNotification(
  userEmail: string,
  breachData: BreachNotificationData,
): Promise<boolean> {
  try {
    await createNotification({
      userEmail,
      type: 'system',
      title: 'Security Notice',
      message: `A security incident may have affected your account. Please review your account security settings.`,
      actionUrl: '/webapp/settings',
      actionLabel: 'Review Settings',
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Expires in 30 days
      metadata: {
        breachId: breachData.breachId,
        breachType: breachData.breachType,
        detectedAt: breachData.detectedAt,
      },
    });

    return true;
  } catch (error) {
    logger.error('[Breach Notification] Failed to create in-app notification:', {
      error: error instanceof Error ? error.message : String(error),
      userEmail,
      breachId: breachData.breachId,
    });
    return false;
  }
}


