import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { createSupabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { sendLeadEmail } from './helpers/sendLeadEmail';

const leadRequestSchema = z.object({
// ... (rest of file)
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

    const resendKey = process.env.RESEND_API_KEY; // Keep this just in case logic depends on it, but email is sent via helper now. Actually helper handles env var.

    // Optional: send email via Resend if configured (no SDK required)
    await sendLeadEmail(name, email);

    return NextResponse.json({ success: true, message: 'Lead captured successfully' });
  } catch (err) {
    // ... (error handling)
    logger.error('[Leads API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/leads', method: 'POST' },
    });
// ...

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
