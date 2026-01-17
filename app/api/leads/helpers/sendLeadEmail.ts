import { logger } from '@/lib/logger';

export async function sendLeadEmail(name: string, email: string) {
  const resendKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.FROM_EMAIL || 'hello@prepflow.org';
  const fromName = process.env.FROM_NAME || 'PrepFlow Team';

  if (!resendKey) return;

  try {
    const subject = `Your PrepFlow Sample Dashboard is Ready, ${name}!`;
    const html = `
      <div style="font-family:Inter,Arial,sans-serif;background:#0a0a0a;color:#fff;padding:24px">
        <h1 style="color:#29E7CD;margin:0 0 12px">PrepFlow Sample Dashboard</h1>
        <p style="margin:0 0 16px">Hi ${name},</p>
        <p style="margin:0 0 16px">Thanks for your interest in PrepFlow. Your sample dashboard is attached below and ready to explore.</p>
        <p style="margin:0 0 16px">Want the full experience? Start your 7-day free trial and see how much margin you can unlock.</p>
        <p style="margin:0 0 24px"><a href="https://www.prepflow.org" style="background:#29E7CD;color:#0a0a0a;padding:10px 16px;border-radius:12px;text-decoration:none;font-weight:600">Get PrepFlow Now</a></p>
        <hr style="border:none;border-top:1px solid #2a2a2a;margin:24px 0"/>
        <p style="font-size:12px;color:#aaa">Sent by PrepFlow • Brisbane, Australia</p>
      </div>
    `;

    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `${fromName} <${fromEmail}>`,
        to: [email],
        subject,
        html,
      }),
    });
  } catch (emailError) {
    // Ignore email failures to not block lead capture
    logger.warn('[Leads API] Failed to send email notification:', {
      error: emailError instanceof Error ? emailError.message : String(emailError),
      context: { endpoint: '/api/leads', operation: 'POST', email },
    });
  }
}
