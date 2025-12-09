/**
 * Lightweight cookie parsing utility for middleware
 * Avoids importing next-auth/jwt which bundles openid-client into edge runtime
 */

import type { NextRequest } from 'next/server';
import { logger } from './logger';

const isDev = process.env.NODE_ENV === 'development';

/**
 * Token structure compatible with next-auth/jwt getToken return type
 */
export interface MiddlewareToken {
  email?: string;
  name?: string;
  picture?: string;
  sub?: string;
  roles?: string[];
  role?: string;
  iat?: number;
  exp?: number;
}

/**
 * Parses cookies from NextRequest
 */
function parseCookies(req: NextRequest): Record<string, string> {
  const cookies: Record<string, string> = {};
  const cookieHeader = req.headers.get('cookie');

  if (!cookieHeader) {
    return cookies;
  }

  cookieHeader.split(';').forEach(cookie => {
    const [name, ...rest] = cookie.trim().split('=');
    if (name) {
      cookies[name] = decodeURIComponent(rest.join('='));
    }
  });

  return cookies;
}

/**
 * Decodes base64url string (JWT format)
 */
function base64UrlDecode(str: string): string {
  // Convert base64url to base64
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');

  // Add padding if needed
  while (base64.length % 4) {
    base64 += '=';
  }

  try {
    // Decode base64
    const decoded = atob(base64);
    return decoded;
  } catch {
    return '';
  }
}

/**
 * Parses JWT payload without verification (for middleware use only)
 * Note: This does NOT verify the signature - only extracts payload
 */
function parseJWTPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const payload = parts[1];
    const decoded = base64UrlDecode(payload);
    return JSON.parse(decoded) as Record<string, unknown>;
  } catch {
    return null;
  }
}

/**
 * Gets NextAuth session token from cookies
 * Returns token data compatible with next-auth/jwt getToken format
 */
export async function getTokenFromCookie(
  req: NextRequest,
  secret?: string,
): Promise<MiddlewareToken | null> {
  const cookies = parseCookies(req);

  // NextAuth cookie names (production uses __Secure- prefix)
  const cookieNames = [
    '__Secure-next-auth.session-token',
    'next-auth.session-token',
    '__Host-next-auth.session-token',
  ];

  let sessionToken: string | undefined;

  // Find the session token cookie
  for (const name of cookieNames) {
    if (cookies[name]) {
      sessionToken = cookies[name];
      break;
    }
  }

  if (!sessionToken) {
    return null;
  }

  // Parse JWT payload (without verification - middleware doesn't need full verification)
  const payload = parseJWTPayload(sessionToken);

  if (!payload) {
    return null;
  }

  // Extract token data compatible with next-auth/jwt format
  const token: MiddlewareToken = {
    email: payload.email as string | undefined,
    name: payload.name as string | undefined,
    picture: payload.picture as string | undefined,
    sub: payload.sub as string | undefined,
    iat: payload.iat as number | undefined,
    exp: payload.exp as number | undefined,
  };

  // Extract roles (can be in various formats)
  if (payload.roles && Array.isArray(payload.roles)) {
    token.roles = payload.roles as string[];
  } else if (payload.role && typeof payload.role === 'string') {
    token.roles = [payload.role];
  } else if ((payload as any)['https://prepflow.org/roles']) {
    token.roles = (payload as any)['https://prepflow.org/roles'] as string[];
  }

  // Set role to first role if roles exist
  if (token.roles && token.roles.length > 0) {
    token.role = token.roles[0];
  }

  // Debug logging in development
  if (isDev) {
    logger.dev('[Middleware Auth] Token extracted:', {
      email: token.email,
      roles: token.roles || [],
      role: token.role || null,
      hasRoles: Boolean(token.roles && token.roles.length > 0),
      payloadKeys: Object.keys(payload),
    });
  }

  return token;
}
