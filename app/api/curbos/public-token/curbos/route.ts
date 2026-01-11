import { ApiErrorHandler } from '@/lib/api-error-handler';
import { getOrCreatePublicToken, regeneratePublicToken } from '@/lib/curbos/public-token';
import { hasCurbOSAccess } from '@/lib/curbos/tier-access';
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import { getTargetEmail } from './helpers/auth-helpers';

/**
 * GET /api/curbos/public-token/curbos
 * Get or create public token for CurbOS user (Supabase auth)
 */
export async function GET(req: NextRequest) {
  try {
    const { targetEmail, isAdminBypass } = await getTargetEmail(req);

    if (!targetEmail) {
      logger.warn('[API /curbos/public-token/curbos] No target email found (not authenticated)');
      return NextResponse.json(
        ApiErrorHandler.createError(
          'Not authenticated with CurbOS or PrepFlow Admin',
          'AUTH_ERROR',
          401,
        ),
        { status: 401 },
      );
    }

    if (!isAdminBypass) {
      const hasAccess = await hasCurbOSAccess(targetEmail, req);
      if (!hasAccess) {
        logger.warn('[API /curbos/public-token/curbos] Access denied (tier required):', {
          email: targetEmail,
        });
        return NextResponse.json(
          ApiErrorHandler.createError('Business tier required', 'UPGRADE_REQUIRED', 403),
          { status: 403 },
        );
      }
    } else {
      logger.dev('[API /curbos/public-token/curbos] Skipping tier check for admin:', {
        email: targetEmail,
      });
    }

    const token = await getOrCreatePublicToken(targetEmail);
    if (!token) {
      logger.error('[API /curbos/public-token/curbos] Failed to get or create token:', {
        email: targetEmail,
        possibleCauses: [
          'Database table curbos_public_tokens may not exist',
          'Database connection issue',
          'RLS policy blocking access',
          'Insert operation failed',
        ],
      });
      return NextResponse.json(
        ApiErrorHandler.createError(
          'Failed to generate token. Please check server logs for details.',
          'SERVER_ERROR',
          500,
        ),
        { status: 500 },
      );
    }

    const publicUrl = `${req.nextUrl.origin}/curbos/public/${token}`;

    return NextResponse.json({
      token,
      publicUrl,
      message: 'Public display link generated',
    });
  } catch (error) {
    logger.error('[API /curbos/public-token/curbos] Error:', {
      error: error instanceof Error ? error.message : String(error),
      context: { endpoint: '/api/curbos/public-token/curbos', method: 'GET' },
    });

    return NextResponse.json(
      ApiErrorHandler.createError('Internal server error', 'SERVER_ERROR', 500),
      { status: 500 },
    );
  }
}

/**
 * POST /api/curbos/public-token/curbos
 * Regenerate public token for CurbOS user (Supabase auth)
 */
export async function POST(req: NextRequest) {
  try {
    const { targetEmail, isAdminBypass } = await getTargetEmail(req);

    if (!targetEmail) {
      logger.warn(
        '[API /curbos/public-token/curbos] No target email found (POST, not authenticated)',
      );
      return NextResponse.json(
        ApiErrorHandler.createError(
          'Not authenticated with CurbOS or PrepFlow Admin',
          'AUTH_ERROR',
          401,
        ),
        { status: 401 },
      );
    }

    if (!isAdminBypass) {
      const hasAccess = await hasCurbOSAccess(targetEmail, req);
      if (!hasAccess) {
        logger.warn('[API /curbos/public-token/curbos] Access denied (POST, tier required):', {
          email: targetEmail,
        });
        return NextResponse.json(
          ApiErrorHandler.createError('Business tier required', 'UPGRADE_REQUIRED', 403),
          { status: 403 },
        );
      }
    } else {
      logger.dev('[API /curbos/public-token/curbos] Skipping tier check (POST) for admin:', {
        email: targetEmail,
      });
    }

    const newToken = await regeneratePublicToken(targetEmail);
    if (!newToken) {
      return NextResponse.json(
        ApiErrorHandler.createError('Failed to regenerate token', 'SERVER_ERROR', 500),
        { status: 500 },
      );
    }

    const publicUrl = `${req.nextUrl.origin}/curbos/public/${newToken}`;

    return NextResponse.json({
      token: newToken,
      publicUrl,
      message: 'Public display link regenerated',
    });
  } catch (error) {
    logger.error('[API /curbos/public-token/curbos] Error:', {
      error: error instanceof Error ? error.message : String(error),
      context: { endpoint: '/api/curbos/public-token/curbos', method: 'POST' },
    });

    return NextResponse.json(
      ApiErrorHandler.createError('Internal server error', 'SERVER_ERROR', 500),
      { status: 500 },
    );
  }
}
