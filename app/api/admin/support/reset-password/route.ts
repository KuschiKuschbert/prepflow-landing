import { requireAdmin } from '@/lib/admin-auth';
import { supabaseAdmin } from '@/lib/supabase';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { logAdminApiAction } from '@/lib/admin-audit';
import { checkAdminRateLimit } from '@/lib/admin-rate-limit';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import crypto from 'crypto';

const resetPasswordSchema = z.object({
  userId: z.string().min(1),
});

/**
 * POST /api/admin/support/reset-password
 * Reset user password and send reset email
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
    const { userId } = resetPasswordSchema.parse(body);

    // Find user by email or ID
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('id, email')
      .or(`id.eq.${userId},email.eq.${userId}`)
      .single();

    if (userError || !user) {
      logger.warn('[Admin Reset Password] User not found:', {
        error: userError?.message,
        code: (userError as unknown)?.code,
        userId,
      });
      return NextResponse.json(ApiErrorHandler.createError('User not found', 'NOT_FOUND', 404), {
        status: 404,
      });
    }

    // Generate password reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours

    // Update user with reset token
    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({
        password_reset_token: resetToken,
        password_reset_expires: resetExpires,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (updateError) {
      logger.error('[Admin Reset Password] Database error:', {
        error: updateError.message,
        context: { endpoint: '/api/admin/support/reset-password', method: 'POST' },
      });

      return NextResponse.json(ApiErrorHandler.fromSupabaseError(updateError, 500), {
        status: 500,
      });
    }

    // TODO: Send password reset email via Resend
    // For now, just log the action

    // Log admin action
    await logAdminApiAction(adminUser, 'reset_user_password', request, {
      target_type: 'user',
      target_id: user.id,
      details: { target_email: user.email },
    });

    return NextResponse.json({
      success: true,
      message: 'Password reset token generated. Email functionality needs to be implemented.',
      resetToken, // In production, don't return token - send via email
      note: 'Password reset email functionality needs to be implemented with Resend.',
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

    logger.error('[Admin Reset Password API] Unexpected error:', {
      error: error instanceof Error ? error.message : String(error),
      context: { endpoint: '/api/admin/support/reset-password', method: 'POST' },
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
