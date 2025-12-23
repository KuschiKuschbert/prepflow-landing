import {
  notifyBreachAffectedUsers,
  updateBreachNotificationStatus,
} from '@/lib/security/breach-notification';

interface BreachNotificationParams {
  breachId: string;
  breachType: string;
  description: string;
  affectedUsers: string[];
  detectedAt: string;
}

/**
 * Send breach notifications to affected users
 *
 * @param {BreachNotificationParams} params - Notification parameters
 * @returns {Promise<{ notified: number; failed: number }>} Notification results
 */
export async function sendBreachNotifications(
  params: BreachNotificationParams,
): Promise<{ notified: number; failed: number }> {
  const notificationResults = await notifyBreachAffectedUsers({
    breachId: params.breachId,
    breachType: params.breachType,
    description: params.description,
    affectedUsers: params.affectedUsers,
    detectedAt: params.detectedAt,
  });
  await updateBreachNotificationStatus(params.breachId, notificationResults);
  return notificationResults;
}


