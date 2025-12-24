/**
 * Notify all affected users of a breach.
 */
import { logger } from '@/lib/logger';
import type { BreachNotificationData } from './sendBreachEmail';
import { sendBreachEmailNotification } from './sendBreachEmail';
import { sendBreachInAppNotification } from './sendBreachInApp';

/**
 * Notify all affected users of a breach
 * @param breachData - Breach information
 * @returns Notification results
 */
export async function notifyBreachAffectedUsers(breachData: BreachNotificationData): Promise<{
  notified: number;
  failed: number;
  results: Array<{ userEmail: string; emailSent: boolean; inAppSent: boolean }>;
}> {
  const results: Array<{ userEmail: string; emailSent: boolean; inAppSent: boolean }> = [];

  for (const userEmail of breachData.affectedUsers) {
    const emailSent = await sendBreachEmailNotification(userEmail, breachData);
    const inAppSent = await sendBreachInAppNotification(userEmail, breachData);

    results.push({
      userEmail,
      emailSent,
      inAppSent,
    });
  }

  const notified = results.filter(r => r.emailSent || r.inAppSent).length;
  const failed = results.length - notified;

  logger.info('[Breach Notification] Notification results:', {
    breachId: breachData.breachId,
    totalUsers: breachData.affectedUsers.length,
    notified,
    failed,
  });

  return {
    notified,
    failed,
    results,
  };
}
