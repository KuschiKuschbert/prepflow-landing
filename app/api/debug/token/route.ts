/**
 * GET /api/debug/token
 * Debug endpoint to inspect current session token (development only)
 */

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { extractAuth0UserId } from '@/lib/auth0-management';

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

export async function GET(request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 });
  }

  try {
    const session = await getServerSession(authOptions);
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    // Extract custom claims from token
    const customClaims: Record<string, unknown> = {};
    if (token) {
      const tokenAny = token as any;
      // Check for common custom claim namespaces
      Object.keys(tokenAny).forEach(key => {
        if (key.startsWith('https://') || key.includes('custom') || key.includes('roles')) {
          customClaims[key] = tokenAny[key];
        }
      });
    }

    // Extract Auth0 user ID
    const auth0UserId = token?.sub ? extractAuth0UserId(token.sub) : null;

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

    return NextResponse.json({
      session: session
        ? {
            user: {
              email: session.user?.email,
              name: session.user?.name,
              roles: (session.user as any)?.roles || [],
              role: (session.user as any)?.role || null,
            },
            expires: session.expires,
          }
        : null,
      token: token
        ? {
            email: token.email,
            name: token.name,
            sub: token.sub,
            auth0UserId: auth0UserId,
            roles: (token as any).roles || [],
            role: (token as any).role || null,
            rolesSource: (token as any).rolesSource || 'unknown',
            iat: token.iat,
            exp: token.exp,
            // Include all token properties for debugging
            allProperties: Object.keys(token),
            // Custom claims found in token
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
        rolesFound: token ? ((token as any).roles || []).length > 0 : false,
        rolesSource: token ? (token as any).rolesSource || 'unknown' : null,
        auth0UserId: auth0UserId,
        recommendation:
          !token || ((token as any).roles || []).length === 0
            ? 'Roles not found in token. Check: 1) Auth0 Actions configured to include roles, 2) Management API fallback is working, 3) User has roles assigned in Auth0'
            : 'Roles found in token',
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to get token',
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
