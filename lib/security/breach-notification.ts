/**
 * Security Breach Notification System
 * Sends notifications to affected users within 72 hours of breach detection
 */

import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { createNotification } from '@/lib/subscription-notifications';

interface BreachNotificationData {
  breachId: string;
  breachType: string;
  description: string;
  affectedUsers: string[];
  detectedAt: string;
}

/**
 * Send breach notification email via Resend
 * @param userEmail - User email to notify
 * @param breachData - Breach information
 * @returns Success status
 */
async function sendBreachEmailNotification(
  userEmail: string,
  breachData: BreachNotificationData,
): Promise<boolean> {
  const resendKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.FROM_EMAIL || 'hello@prepflow.org';
  const fromName = process.env.FROM_NAME || 'PrepFlow Team';

  if (!resendKey) {
    logger.warn('[Breach Notification] Resend API key not configured, skipping email');
    return false;
  }

  try {
    const subject = 'Important: Security Notice from PrepFlow';
    const html = `
      <div style="font-family:Inter,Arial,sans-serif;background:#0a0a0a;color:#fff;padding:24px;max-width:600px;margin:0 auto">
        <h1 style="color:#29E7CD;margin:0 0 12px">Security Notice</h1>
        <p style="margin:0 0 16px;color:#fff">Dear PrepFlow User,</p>
        <p style="margin:0 0 16px;color:#fff">
          We are writing to inform you of a security incident that may have affected your account.
          We detected this issue on ${new Date(breachData.detectedAt).toLocaleDateString('en-AU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}.
        </p>
        <div style="background:#1f1f1f;border:1px solid #2a2a2a;border-radius:12px;padding:16px;margin:16px 0">
          <h2 style="color:#29E7CD;margin:0 0 8px;font-size:18px">What Happened</h2>
          <p style="margin:0;color:#ccc">${breachData.description}</p>
        </div>
        <h2 style="color:#fff;margin:16px 0 8px;font-size:18px">What You Should Do</h2>
        <ul style="margin:0 0 16px;padding-left:20px;color:#ccc">
          <li style="margin:8px 0">Change your password immediately</li>
          <li style="margin:8px 0">Review your account activity for any unauthorized access</li>
          <li style="margin:8px 0">Enable two-factor authentication if available</li>
          <li style="margin:8px 0">Contact us if you notice any suspicious activity</li>
        </ul>
        <p style="margin:0 0 16px;color:#fff">
          We take your security seriously and have taken steps to address this issue. If you have
          any questions or concerns, please contact us at{' '}
          <a href="mailto:support@prepflow.org" style="color:#29E7CD;text-decoration:none">support@prepflow.org</a>.
        </p>
        <p style="margin:0 0 24px;color:#fff">Thank you for your understanding.</p>
        <hr style="border:none;border-top:1px solid #2a2a2a;margin:24px 0"/>
        <p style="font-size:12px;color:#aaa;margin:0">
          This is an automated security notification from PrepFlow. Please do not reply to this email.
        </p>
      </div>
    `;

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `${fromName} <${fromEmail}>`,
        to: [userEmail],
        subject,
        html,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      logger.error('[Breach Notification] Failed to send email:', {
        userEmail,
        status: response.status,
        error: errorData,
      });
      return false;
    }

    logger.info('[Breach Notification] Email sent successfully:', {
      userEmail,
      breachId: breachData.breachId,
    });

    return true;
  } catch (error) {
    logger.error('[Breach Notification] Unexpected error sending email:', {
      error: error instanceof Error ? error.message : String(error),
      userEmail,
      breachId: breachData.breachId,
    });
    return false;
  }
}

/**
 * Send in-app notification to affected user
 * @param userEmail - User email to notify
 * @param breachData - Breach information
 * @returns Success status
 */
async function sendBreachInAppNotification(
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

/**
 * Update breach status after notification
 * @param breachId - Breach ID
 * @param notificationResults - Notification results
 * @returns Success status
 */
export async function updateBreachNotificationStatus(
  breachId: string,
  notificationResults: {
    notified: number;
    failed: number;
  },
): Promise<boolean> {
  if (!supabaseAdmin) {
    logger.error('[Breach Notification] Supabase not available, cannot update status');
    return false;
  }

  try {
    const status = notificationResults.failed === 0 ? 'notified' : 'failed';
    const notificationSentAt = new Date().toISOString();
    const notificationFailureReason =
      notificationResults.failed > 0
        ? `Failed to notify ${notificationResults.failed} of ${notificationResults.notified + notificationResults.failed} users`
        : null;

    const { error } = await supabaseAdmin
      .from('security_breaches')
      .update({
        status,
        notification_sent_at: notificationSentAt,
        notification_failed_at: notificationResults.failed > 0 ? notificationSentAt : null,
        notification_failure_reason: notificationFailureReason,
        reported_at: notificationSentAt,
      })
      .eq('id', breachId);

    if (error) {
      logger.error('[Breach Notification] Failed to update breach status:', {
        error: error.message,
        breachId,
      });
      return false;
    }

    logger.info('[Breach Notification] Breach status updated:', {
      breachId,
      status,
      notified: notificationResults.notified,
      failed: notificationResults.failed,
    });

    return true;
  } catch (error) {
    logger.error('[Breach Notification] Unexpected error updating status:', {
      error: error instanceof Error ? error.message : String(error),
      breachId,
    });
    return false;
  }
}

/**
 * Process all breaches that need notification (within 72-hour window)
 * This should be called periodically (e.g., via cron job)
 * @returns Processing results
 */
export async function processPendingBreachNotifications(): Promise<{
  processed: number;
  notified: number;
  failed: number;
}> {
  if (!supabaseAdmin) {
    logger.warn('[Breach Notification] Supabase not available, cannot process breaches');
    return { processed: 0, notified: 0, failed: 0 };
  }

  try {
    // Get breaches detected within last 72 hours that are still pending
    const seventyTwoHoursAgo = new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString();

    const { data: breaches, error } = await supabaseAdmin
      .from('security_breaches')
      .select('id, breach_type, description, affected_users, detected_at')
      .eq('status', 'pending')
      .gte('detected_at', seventyTwoHoursAgo)
      .order('detected_at', { ascending: true });

    if (error) {
      logger.error('[Breach Notification] Failed to get pending breaches:', {
        error: error.message,
      });
      return { processed: 0, notified: 0, failed: 0 };
    }

    if (!breaches || breaches.length === 0) {
      return { processed: 0, notified: 0, failed: 0 };
    }

    let totalNotified = 0;
    let totalFailed = 0;

    for (const breach of breaches) {
      const breachData: BreachNotificationData = {
        breachId: breach.id,
        breachType: breach.breach_type,
        description: breach.description,
        affectedUsers: breach.affected_users || [],
        detectedAt: breach.detected_at,
      };

      const notificationResults = await notifyBreachAffectedUsers(breachData);
      await updateBreachNotificationStatus(breach.id, notificationResults);

      totalNotified += notificationResults.notified;
      totalFailed += notificationResults.failed;
    }

    logger.info('[Breach Notification] Processed pending breaches:', {
      processed: breaches.length,
      notified: totalNotified,
      failed: totalFailed,
    });

    return {
      processed: breaches.length,
      notified: totalNotified,
      failed: totalFailed,
    };
  } catch (error) {
    logger.error('[Breach Notification] Unexpected error processing breaches:', {
      error: error instanceof Error ? error.message : String(error),
    });
    return { processed: 0, notified: 0, failed: 0 };
  }
}



