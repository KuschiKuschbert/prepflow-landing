/**
 * Send breach notification email via Resend.
 */
import { logger } from '@/lib/logger';

export interface BreachNotificationData {
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
export async function sendBreachEmailNotification(
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
          This is an automated security notification from PrepFlow. Please don&apos;t reply to this email.
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
      let errorData = {};
      try {
        errorData = await response.json();
      } catch (err) {
        logger.warn('[Breach Notification] Failed to parse error response:', {
          error: err instanceof Error ? err.message : String(err),
        });
      }
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




