/**
 * GET /api/debug/token
 * Debug endpoint to inspect current session token (development only)
 */

import { ApiErrorHandler } from '@/lib/api-error-handler';
import { auth0 } from '@/lib/auth0';
import { extractAuth0UserId } from '@/lib/auth0-management';
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Decode JWT payload without verification
 */
function decodeJWTPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    // Decode base64url
    const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = payload + '='.repeat((4 - (payload.length % 4)) % 4);
    const decoded = Buffer.from(padded, 'base64').toString('utf-8');
    return JSON.parse(decoded) as Record<string, unknown>;
  } catch {
    return null;
  }
}

interface Auth0User {
  email?: string | null;
  name?: string | null;
  sub?: string | null;
  picture?: string | null;
  [key: string]: unknown;
}

interface Auth0Session {
  user?: Auth0User;
  expiresAt?: number;
}

export async function GET(request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      ApiErrorHandler.createError('Not available in production', 'FORBIDDEN', 403),
      { status: 403 },
    );
  }

  try {
    const session = (await auth0.getSession(request)) as Auth0Session | null;

    // Extract custom claims from session user
    const customClaims: Record<string, unknown> = {};
    if (session?.user) {
      // Check for common custom claim namespaces
      Object.keys(session.user).forEach(key => {
        if (key.startsWith('https://') || key.includes('custom') || key.includes('roles')) {
          customClaims[key] = session.user![key];
        }
      });
    }

    // Extract Auth0 user ID
    const auth0UserId = session?.user?.sub ? extractAuth0UserId(session.user.sub) : null;

    // Try to decode id_token if available in cookies (for initial sign-in)
    let idTokenPayload: Record<string, unknown> | null = null;
    const cookies = request.headers.get('cookie');
    if (cookies) {
      // Look for id_token in cookies (Auth0 might store it temporarily)
      const idTokenMatch = cookies.match(/id_token=([^;]+)/);
      if (idTokenMatch) {
        idTokenPayload = decodeJWTPayload(decodeURIComponent(idTokenMatch[1]));
      }
    }

    const userRoles =
      (session?.user?.['https://prepflow.org/roles'] as string[] | undefined) || [];

    return NextResponse.json({
      session: session
        ? {
            user: {
              email: session.user?.email,
              name: session.user?.name,
              sub: session.user?.sub,
              roles: userRoles,
              picture: session.user?.picture,
            },
            expiresAt: session.expiresAt,
          }
        : null,
      token: session?.user
        ? {
            email: session.user.email,
            name: session.user.name,
            sub: session.user.sub,
            auth0UserId: auth0UserId,
            roles: userRoles,
            // Include all user properties for debugging
            allProperties: Object.keys(session.user),
            // Custom claims found in user object
            customClaims: Object.keys(customClaims).length > 0 ? customClaims : null,
          }
        : null,
      idToken: idTokenPayload
        ? {
            payload: idTokenPayload,
            customClaims: Object.keys(idTokenPayload)
              .filter(
                key =>
                  key.startsWith('https://') || key.includes('custom') || key.includes('roles'),
              )
              .reduce(
                (acc, key) => {
                  acc[key] = idTokenPayload![key];
                  return acc;
                },
                {} as Record<string, unknown>,
              ),
          }
        : null,
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        AUTH0_CONFIGURED: Boolean(
          process.env.AUTH0_ISSUER_BASE_URL &&
            process.env.AUTH0_CLIENT_ID &&
            process.env.AUTH0_CLIENT_SECRET,
        ),
        AUTH0_DOMAIN: process.env.AUTH0_ISSUER_BASE_URL
          ? process.env.AUTH0_ISSUER_BASE_URL.replace(/^https?:\/\//, '').replace(/\/$/, '')
          : null,
        ADMIN_BYPASS: process.env.ADMIN_BYPASS === 'true',
      },
      troubleshooting: {
        rolesFound: userRoles.length > 0,
        auth0UserId: auth0UserId,
        recommendation:
          !session?.user || userRoles.length === 0
            ? 'Roles not found in session. Check: 1) Auth0 Actions configured to include roles, 2) Management API fallback is working, 3) User has roles assigned in Auth0'
            : 'Roles found in session',
      },
    });
  } catch (error) {
    logger.error('[Debug Token API] Error getting token:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      context: { endpoint: '/api/debug/token', method: 'GET' },
    });
    return NextResponse.json(
      {
        error: 'Failed to get token',
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
