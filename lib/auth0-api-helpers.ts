import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from './admin-utils';
import { isEmailAllowed } from './allowlist';
import { extractUserFromSession } from './auth0-api-helpers/helpers/extractUserFromSession';
import { getDevUser } from './auth0-api-helpers/helpers/getDevUser';

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
  email_verified?: boolean;
} | null> {
  if (isDev && authBypassDev) {
    return getDevUser();
  }
  return extractUserFromSession(req);
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
  email_verified?: boolean;
}> {
  if (isDev && authBypassDev) {
    return getDevUser();
  }

  const user = await getUserFromRequest(req);
  if (!user) {
    throw NextResponse.json(
      { error: 'Unauthorized', message: 'Authentication required' },
      { status: 401 },
    );
  }

  // Enforce allowlist in production if enabled (Admins bypass allowlist)
  const allowlistEnabled = process.env.DISABLE_ALLOWLIST !== 'true';
  const isUserAdmin = isAdmin(user);

  if (
    process.env.NODE_ENV === 'production' &&
    allowlistEnabled &&
    !isEmailAllowed(user.email) &&
    !isUserAdmin
  ) {
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
  email_verified?: boolean;
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
