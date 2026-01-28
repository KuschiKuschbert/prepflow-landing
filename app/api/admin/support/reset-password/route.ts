import { logAdminApiAction } from '@/lib/admin-audit';
import { standardAdminChecks } from '@/lib/admin-auth';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { sendEmail } from '@/lib/email/sender';
import { logger } from '@/lib/logger';
import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const resetPasswordSchema = z.object({
  userId: z.string().min(1),
});

/**
 * POST /api/admin/support/reset-password
 * Reset user password and send reset email
 */
export async function POST(request: NextRequest) {
  try {
    const { adminUser, supabase, error } = await standardAdminChecks(request, true);
    if (error) return error;

    // Type guard for adminUser and supabase (since standardAdminChecks ensures they exist if no error)
    if (!adminUser || !supabase) throw new Error('Unexpected authentication state');

    const body = await request.json();
    const { userId } = resetPasswordSchema.parse(body);

    // Find user by email or ID
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email')
      .or(`id.eq.${userId},email.eq.${userId}`)
      .single();

    if (userError || !user) {
      logger.warn('[Admin Reset Password] User not found:', {
        error: userError?.message,
        code: userError?.code,
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
    const { error: updateError } = await supabase
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

    // Send password reset email via Resend
    if (process.env.RESEND_API_KEY) {
      const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || 'https://app.prepflow.io'}/reset-password?token=${resetToken}`;

      await sendEmail({
        to: user.email,
        subject: 'Password Reset Request',
        html: `
          <div style="font-family:sans-serif;padding:20px;color:#333;">
            <h2 style="color:#29E7CD;">Password Reset</h2>
            <p>Hello,</p>
            <p>An administrator has requested a password reset for your PrepFlow account.</p>
            <p>Click the link below to set a new password:</p>
            <p style="margin:20px 0;">
              <a href="${resetLink}" style="background:#29E7CD;color:#000;padding:12px 24px;text-decoration:none;border-radius:5px;font-weight:bold;">Reset Password</a>
            </p>
            <p>This link will expire in 24 hours.</p>
            <p>If you did not request this, please contact support immediately.</p>
          </div>
        `,
      });
    }

    // Log admin action
    await logAdminApiAction(adminUser, 'reset_user_password', request, {
      target_type: 'user',
      target_id: user.id,
      details: { target_email: user.email },
    });

    return NextResponse.json({
      success: true,
      message: 'Password reset instructions have been sent to the user.',
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
