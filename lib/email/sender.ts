/**
 * Centralized email sending utility using Resend.
 */
import { logger } from '@/lib/logger';

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}

/**
 * Send an email via Resend API.
 */
export async function sendEmail({ to, subject, html, from }: SendEmailOptions): Promise<boolean> {
  const resendKey = process.env.RESEND_API_KEY;
  const defaultFrom = process.env.FROM_EMAIL || 'hello@prepflow.org';
  const defaultFromName = process.env.FROM_NAME || 'PrepFlow Team';
  const sender = from || `${defaultFromName} <${defaultFrom}>`;

  if (!resendKey) {
    logger.warn('[Email Sender] RESEND_API_KEY not configured, skipping email', {
      to,
      subject,
    });
    return false;
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: sender,
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
      }),
    });

    if (!response.ok) {
      let errorData = {};
      try {
        errorData = await response.json();
      } catch (e) {
        // ignore parse error
      }

      logger.error('[Email Sender] Failed to send email:', {
        status: response.status,
        error: errorData,
        to,
        subject,
      });
      return false;
    }

    logger.info('[Email Sender] Email sent successfully:', { to, subject });
    return true;
  } catch (error) {
    logger.error('[Email Sender] Unexpected error:', {
      error: error instanceof Error ? error.message : String(error),
      to,
      subject,
    });
    return false;
  }
}
