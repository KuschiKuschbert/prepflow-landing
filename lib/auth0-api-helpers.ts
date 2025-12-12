import { auth0 } from './auth0';
import { NextRequest, NextResponse } from 'next/server';
import { isEmailAllowed } from './allowlist';
import { isAdmin } from './admin-utils';
import { logger } from './logger';

const isDev = process.env.NODE_ENV === 'development';
const authBypassDev = process.env.AUTH0_BYPASS_DEV === 'true';

/**
 * Extract user from Auth0 session
 * Returns null if not authenticated or in development (bypass mode)
 */
export async function getUserFromRequest(req: NextRequest): Promise<{
  email: string;
  name?: string;
  picture?: string;
  sub: string;
  roles?: string[];
} | null> {
  // Development bypass: Return mock user if configured
  if (isDev && authBypassDev) {
    return {
      email: 'dev@prepflow.org',
      name: 'Dev User',
      sub: 'dev|123',
      roles: ['admin'],
    };
  }

  try {
    const session = await auth0.getSession(req);
    if (!session?.user) {
      return null;
    }

    return {
      email: session.user.email || '',
      name: session.user.name,
      picture: session.user.picture,
      sub: session.user.sub || '',
      roles: (session.user as any)['https://prepflow.org/roles'] || [],
    };
  } catch (error) {
    logger.error('[Auth0 API Helpers] Failed to get user from request:', {
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}

/**
 * Require authentication in API routes
 * Returns user if authenticated, throws NextResponse with 401 if not
 */
export async function requireAuth(req: NextRequest): Promise<{
  email: string;
  name?: string;
  picture?: string;
  sub: string;
  roles?: string[];
}> {
  // Development bypass: Return mock user
  if (isDev && authBypassDev) {
    return {
      email: 'dev@prepflow.org',
      name: 'Dev User',
      sub: 'dev|123',
      roles: ['admin'],
    };
  }

  const user = await getUserFromRequest(req);
  if (!user) {
    throw NextResponse.json(
      { error: 'Unauthorized', message: 'Authentication required' },
      { status: 401 },
    );
  }

  // Enforce allowlist in production if enabled
  const allowlistEnabled = process.env.DISABLE_ALLOWLIST !== 'true';
  if (process.env.NODE_ENV === 'production' && allowlistEnabled && !isEmailAllowed(user.email)) {
    throw NextResponse.json(
      { error: 'Forbidden', message: 'Email not in allowlist' },
      { status: 403 },
    );
  }

  return user;
}

/**
 * Require admin role in API routes
 * Returns user if admin, throws NextResponse with 403 if not
 */
export async function requireAdmin(req: NextRequest): Promise<{
  email: string;
  name?: string;
  picture?: string;
  sub: string;
  roles?: string[];
}> {
  const user = await requireAuth(req);

  // Development bypass: Always allow admin
  if (isDev && authBypassDev) {
    return user;
  }

  // Check if user has admin role
  if (!isAdmin(user)) {
    throw NextResponse.json(
      { error: 'Forbidden', message: 'Admin access required' },
      { status: 403 },
    );
  }

  return user;
}

/**
 * Extract email from Auth0 session
 * Returns null if not authenticated
 */
export async function getUserEmail(req: NextRequest): Promise<string | null> {
  const user = await getUserFromRequest(req);
  return user?.email || null;
}

/**
 * Check if user is authenticated (for conditional logic)
 */
export async function isAuthenticated(req: NextRequest): Promise<boolean> {
  if (isDev && authBypassDev) {
    return true; // Always authenticated in dev bypass mode
  }

  const user = await getUserFromRequest(req);
  return user !== null;
}

/**
 * Check if user email is allowed (for allowlist enforcement)
 * Returns true if allowlist is disabled or user email is in allowlist
 */
export async function isUserAllowed(req: NextRequest): Promise<boolean> {
  // Development bypass: Always allowed
  if (isDev && authBypassDev) {
    return true;
  }

  const email = await getUserEmail(req);
  if (!email) {
    return false;
  }

  return isEmailAllowed(email);
}
