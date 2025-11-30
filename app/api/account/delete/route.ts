import { ApiErrorHandler } from '@/lib/api-error-handler';
import { authOptions } from '@/lib/auth-options';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/account/delete
 * Request account deletion with grace period
 * Sets deletion_requested_at timestamp. Account will be permanently deleted after grace period.
 *
 * @param {NextRequest} req - Request object (for query params like ?cancel=true)
 * @returns {Promise<NextResponse>} Deletion request response
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        ApiErrorHandler.createError('Authentication required', 'UNAUTHORIZED', 401),
        { status: 401 },
      );
    }

    const userEmail = session.user.email;
    const { searchParams } = new URL(req.url);
    const cancel = searchParams.get('cancel') === 'true';

    if (!supabaseAdmin) {
      logger.warn('[Account Delete API] Supabase not available');
      return NextResponse.json(
        ApiErrorHandler.createError('Database not available', 'SERVICE_UNAVAILABLE', 503),
        { status: 503 },
      );
    }

    // Get user
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('id, deletion_requested_at')
      .eq('email', userEmail)
      .single();

    if (cancel) {
      // Cancel deletion request
      if (!userData?.deletion_requested_at) {
        return NextResponse.json({
          success: true,
          message: 'No deletion request to cancel',
        });
      }

      const { error: updateError } = await supabaseAdmin
        .from('users')
        .update({
          deletion_requested_at: null,
          updated_at: new Date().toISOString(),
        })
        .eq('email', userEmail);

      if (updateError) {
        logger.error('[Account Delete API] Failed to cancel deletion:', {
          error: updateError.message,
        });
        return NextResponse.json(
          ApiErrorHandler.createError('Failed to cancel deletion', 'DATABASE_ERROR', 500),
          { status: 500 },
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Account deletion cancelled. Your account is safe.',
      });
    }

    // Request deletion
    const deletionRequestedAt = new Date().toISOString();
    const gracePeriodDays = 7;
    const deletionDate = new Date();
    deletionDate.setDate(deletionDate.getDate() + gracePeriodDays);

    if (!userData) {
      // Create user record if it doesn't exist
      const { error: createError } = await supabaseAdmin.from('users').insert({
        email: userEmail,
        deletion_requested_at: deletionRequestedAt,
        updated_at: new Date().toISOString(),
      });

      if (createError) {
        logger.error('[Account Delete API] Failed to create user:', {
          error: createError.message,
        });
        return NextResponse.json(
          ApiErrorHandler.createError('Failed to request deletion', 'DATABASE_ERROR', 500),
          { status: 500 },
        );
      }
    } else {
      // Update existing user
      const { error: updateError } = await supabaseAdmin
        .from('users')
        .update({
          deletion_requested_at: deletionRequestedAt,
          updated_at: new Date().toISOString(),
        })
        .eq('email', userEmail);

      if (updateError) {
        logger.error('[Account Delete API] Failed to update deletion request:', {
          error: updateError.message,
        });
        return NextResponse.json(
          ApiErrorHandler.createError('Failed to request deletion', 'DATABASE_ERROR', 500),
          { status: 500 },
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: `Account deletion requested. Your account will be permanently deleted on ${deletionDate.toLocaleDateString('en-AU')}. You can cancel this request anytime before then.`,
      deletion_date: deletionDate.toISOString(),
      grace_period_days: gracePeriodDays,
    });
  } catch (error) {
    logger.error('[Account Delete API] Unexpected error:', {
      error: error instanceof Error ? error.message : String(error),
      context: { endpoint: '/api/account/delete', method: 'POST' },
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
