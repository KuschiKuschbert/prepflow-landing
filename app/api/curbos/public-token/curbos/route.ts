import { hasCurbOSAccess } from '@/lib/curbos/tier-access';
import { getOrCreatePublicToken, regeneratePublicToken } from '@/lib/curbos/public-token';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/curbos/public-token/curbos
 * Get or create public token for CurbOS user (Supabase auth)
 * This endpoint works with CurbOS Supabase authentication, not PrepFlow Auth0
 */
export async function GET(req: NextRequest) {
  try {
    // Get user email from CurbOS auth cookie
    const userEmailCookie = req.cookies.get('curbos_user_email')?.value;

    if (!userEmailCookie) {
      return NextResponse.json(
        ApiErrorHandler.createError('Not authenticated with CurbOS', 'AUTH_ERROR', 401),
        { status: 401 },
      );
    }

    // Check Business tier access (or admin)
    const hasAccess = await hasCurbOSAccess(userEmailCookie, req);
    if (!hasAccess) {
      return NextResponse.json(
        ApiErrorHandler.createError('Business tier required', 'UPGRADE_REQUIRED', 403),
        { status: 403 },
      );
    }

    // Get or create token
    const token = await getOrCreatePublicToken(userEmailCookie);
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
    // Get user email from CurbOS auth cookie
    const userEmailCookie = req.cookies.get('curbos_user_email')?.value;

    if (!userEmailCookie) {
      return NextResponse.json(
        ApiErrorHandler.createError('Not authenticated with CurbOS', 'AUTH_ERROR', 401),
        { status: 401 },
      );
    }

    // Check Business tier access (or admin)
    const hasAccess = await hasCurbOSAccess(userEmailCookie, req);
    if (!hasAccess) {
      return NextResponse.json(
        ApiErrorHandler.createError('Business tier required', 'UPGRADE_REQUIRED', 403),
        { status: 403 },
      );
    }

    // Regenerate token
    const newToken = await regeneratePublicToken(userEmailCookie);
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
