import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { createSupabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const leadRequestSchema = z.object({
  name: z.string().min(1, 'Name is required').trim(),
  email: z.string().email('Please provide a valid email address').trim().toLowerCase(),
  source: z.string().trim().default('unknown'),
});

export async function POST(req: Request) {
  try {
    let body = {};
    try {
      body = await req.json();
    } catch (err) {
      logger.warn('[Leads API] Failed to parse request body:', {
        error: err instanceof Error ? err.message : String(err),
      });
    }
    const validationResult = leadRequestSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          validationResult.error.issues[0]?.message || 'Invalid request body',
          'VALIDATION_ERROR',
          400,
        ),
        { status: 400 },
      );
    }

    const { name, email, source } = validationResult.data;

    const supabase = createSupabaseAdmin();

    // Ensure leads table exists; if not, return guidance instead of failing hard
    const { error: tableCheckError } = await supabase.from('leads').select('id').limit(1);
    if (tableCheckError) {
      logger.error('[Leads API] Table check error:', {
        error: tableCheckError.message,
        context: { endpoint: '/api/leads', operation: 'POST' },
      });
      return NextResponse.json(
        ApiErrorHandler.createError(
          'Table leads does not exist. Please create tables first.',
          'TABLE_NOT_FOUND',
          400,
          {
            instructions:
              'Visit /api/create-tables for SQL script and ensure a leads table with (id uuid default gen_random_uuid(), name text, email text unique, source text, created_at timestamptz default now()).',
          },
        ),
        { status: 400 },
      );
    }

    // Upsert lead to avoid duplicates
    const { error: upsertError } = await supabase
      .from('leads')
      .upsert({ name, email, source }, { onConflict: 'email' });

    if (upsertError) {
      logger.error('[Leads API] Database error saving lead:', {
        error: upsertError.message,
        code: upsertError.code,
        context: { endpoint: '/api/leads', operation: 'POST', email },
      });

      const apiError = ApiErrorHandler.fromSupabaseError(upsertError, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    // Optional: send email via Resend if configured (no SDK required)
    const resendKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.FROM_EMAIL || 'hello@prepflow.org';
    const fromName = process.env.FROM_NAME || 'PrepFlow Team';

    if (resendKey) {
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

    return NextResponse.json({ success: true, message: 'Lead captured successfully' });
  } catch (err) {
    logger.error('[Leads API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/leads', method: 'POST' },
    });

    return NextResponse.json(
      ApiErrorHandler.createError(
        process.env.NODE_ENV === 'development'
          ? err instanceof Error
            ? err.message
            : 'Unknown error'
          : 'Unexpected error while capturing lead',
        'SERVER_ERROR',
        500,
      ),
      { status: 500 },
    );
  }
}
