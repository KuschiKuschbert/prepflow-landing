import { requireAdmin } from '@/lib/admin-auth';
import { supabaseAdmin } from '@/lib/supabase';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { logAdminApiAction } from '@/lib/admin-audit';
import { checkAdminRateLimit } from '@/lib/admin-rate-limit';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import crypto from 'crypto';

const impersonateSchema = z.object({
  userId: z.string().min(1),
});

/**
 * POST /api/admin/support/impersonate
 * Generate impersonation token for a user
 */
export async function POST(request: NextRequest) {
  try {
    const adminUser = await requireAdmin(request);

    // Stricter rate limiting for critical operations
    if (!checkAdminRateLimit(adminUser.id, true)) {
      return NextResponse.json(
        ApiErrorHandler.createError('Rate limit exceeded', 'RATE_LIMIT_EXCEEDED', 429),
        { status: 429 },
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    const body = await request.json();
    const { userId } = impersonateSchema.parse(body);

    // Find user by email or ID
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('id, email')
      .or(`id.eq.${userId},email.eq.${userId}`)
      .single();

    if (userError || !user) {
      logger.warn('[Admin Impersonate API] User not found:', {
        error: userError?.message,
        code: (userError as any)?.code,
        userId,
      });
      return NextResponse.json(ApiErrorHandler.createError('User not found', 'NOT_FOUND', 404), {
        status: 404,
      });
    }

    // Generate temporary impersonation token (valid for 1 hour)
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

    // Store impersonation session (would need impersonation_sessions table)
    // For now, return token directly - in production, store in database

    // Log admin action
    await logAdminApiAction(adminUser, 'impersonate_user', request, {
      target_type: 'user',
      target_id: user.id,
      details: { target_email: user.email, token_expires_at: expiresAt },
    });

    return NextResponse.json({
      success: true,
      token,
      userId: user.id,
      expiresAt,
      message: 'Impersonation token generated. Use ?impersonate=token in webapp URL.',
    });
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        ApiErrorHandler.createError('Invalid request data', 'VALIDATION_ERROR', 400, error.issues),
        { status: 400 },
      );
    }

    logger.error('[Admin Impersonate API] Unexpected error:', {
      error: error instanceof Error ? error.message : String(error),
      context: { endpoint: '/api/admin/support/impersonate', method: 'POST' },
    });

    return NextResponse.json(
      ApiErrorHandler.createError(
        process.env.NODE_ENV === 'development'
          ? error instanceof Error
            ? error.message
            : 'Unknown error'
          : 'Internal server error',
        'SERVER_ERROR',
        500,
      ),
      { status: 500 },
    );
  }
}
