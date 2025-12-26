import { requireAuth } from '@/lib/auth0-api-helpers';
import { hasCurbOSAccess } from '@/lib/curbos/tier-access';
import { getOrCreatePublicToken, regeneratePublicToken } from '@/lib/curbos/public-token';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/curbos/public-token
 * Get or create public token for authenticated Business tier user
 */
export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    const userEmail = user.email;

    if (!userEmail) {
      return NextResponse.json(
        ApiErrorHandler.createError('User email not found', 'AUTH_ERROR', 401),
        { status: 401 },
      );
    }

    // Check Business tier access (or admin)
    const hasAccess = await hasCurbOSAccess(userEmail, req);
    if (!hasAccess) {
      return NextResponse.json(
        ApiErrorHandler.createError('Business tier required', 'UPGRADE_REQUIRED', 403),
        { status: 403 },
      );
    }

    // Get or create token
    const token = await getOrCreatePublicToken(userEmail);
    if (!token) {
      return NextResponse.json(
        ApiErrorHandler.createError('Failed to generate token', 'SERVER_ERROR', 500),
        { status: 500 },
      );
    }

    // Return public URL
    const publicUrl = `${req.nextUrl.origin}/curbos/public/${token}`;

    return NextResponse.json({
      token,
      publicUrl,
      message: 'Public display link generated',
    });
  } catch (error) {
    // requireAuth throws NextResponse, so rethrow it
    if (error instanceof NextResponse) {
      throw error;
    }

    logger.error('[API /curbos/public-token] Error:', {
      error: error instanceof Error ? error.message : String(error),
      context: { endpoint: '/api/curbos/public-token', method: 'GET' },
    });

    return NextResponse.json(
      ApiErrorHandler.createError('Internal server error', 'SERVER_ERROR', 500),
      { status: 500 },
    );
  }
}

/**
 * POST /api/curbos/public-token
 * Regenerate public token (if compromised)
 */
export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    const userEmail = user.email;

    if (!userEmail) {
      return NextResponse.json(
        ApiErrorHandler.createError('User email not found', 'AUTH_ERROR', 401),
        { status: 401 },
      );
    }

    // Check Business tier access (or admin)
    const hasAccess = await hasCurbOSAccess(userEmail, req);
    if (!hasAccess) {
      return NextResponse.json(
        ApiErrorHandler.createError('Business tier required', 'UPGRADE_REQUIRED', 403),
        { status: 403 },
      );
    }

    // Regenerate token
    const newToken = await regeneratePublicToken(userEmail);
    if (!newToken) {
      return NextResponse.json(
        ApiErrorHandler.createError('Failed to regenerate token', 'SERVER_ERROR', 500),
        { status: 500 },
      );
    }

    // Return new public URL
    const publicUrl = `${req.nextUrl.origin}/curbos/public/${newToken}`;

    return NextResponse.json({
      token: newToken,
      publicUrl,
      message: 'Public display link regenerated',
    });
  } catch (error) {
    // requireAuth throws NextResponse, so rethrow it
    if (error instanceof NextResponse) {
      throw error;
    }

    logger.error('[API /curbos/public-token] Error:', {
      error: error instanceof Error ? error.message : String(error),
      context: { endpoint: '/api/curbos/public-token', method: 'POST' },
    });

    return NextResponse.json(
      ApiErrorHandler.createError('Internal server error', 'SERVER_ERROR', 500),
      { status: 500 },
    );
  }
}
