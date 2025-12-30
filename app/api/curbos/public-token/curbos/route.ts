import { isAdmin as checkUserAdminRole } from '@/lib/admin-utils';
import { isEmailAllowed } from '@/lib/allowlist';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { getUserFromRequest } from '@/lib/auth0-api-helpers';
import { getOrCreatePublicToken, regeneratePublicToken } from '@/lib/curbos/public-token';
import { hasCurbOSAccess } from '@/lib/curbos/tier-access';
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
    let targetEmail = userEmailCookie;
    let isAdminBypass = false;

    if (!targetEmail) {
      // Fallback: Check if user is a PrepFlow admin (Auth0 session) directly
      try {
        const user = await getUserFromRequest(req);
        if (user?.email) {
          const isEmailInAllowlist = isEmailAllowed(user.email);
          const hasAdminRole = checkUserAdminRole(user);
          if (isEmailInAllowlist || hasAdminRole) {
            targetEmail = user.email;
            isAdminBypass = true;
            logger.dev(
              '[API /curbos/public-token/curbos] Admin bypass granted via internal check:',
              { email: targetEmail },
            );
          }
        }
      } catch (adminError) {
        logger.warn(
          '[API /curbos/public-token/curbos] Error checking admin status internally:',
          adminError,
        );
      }
    }

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

    // Check Business tier access (skip if admin bypass is active)
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

    // Get or create token
    const token = await getOrCreatePublicToken(targetEmail);
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
    let targetEmail = userEmailCookie;
    let isAdminBypass = false;

    if (!targetEmail) {
      // Fallback: Check if user is a PrepFlow admin (Auth0 session) directly
      try {
        const user = await getUserFromRequest(req);
        if (user?.email) {
          const isEmailInAllowlist = isEmailAllowed(user.email);
          const hasAdminRole = checkUserAdminRole(user);
          if (isEmailInAllowlist || hasAdminRole) {
            targetEmail = user.email;
            isAdminBypass = true;
            logger.dev(
              '[API /curbos/public-token/curbos] Admin bypass granted (POST) via internal check:',
              { email: targetEmail },
            );
          }
        }
      } catch (adminError) {
        logger.warn(
          '[API /curbos/public-token/curbos] Error checking admin status internally (POST):',
          adminError,
        );
      }
    }

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

    // Check Business tier access (skip if admin bypass is active)
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

    // Regenerate token
    const newToken = await regeneratePublicToken(targetEmail);
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
