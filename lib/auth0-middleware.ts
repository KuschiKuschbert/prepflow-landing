import { auth0, isAuthRequired } from './auth0';
import type { NextRequest } from 'next/server';
import { isEmailAllowed } from './allowlist';
import { isAdmin } from './admin-utils';

const isDev = process.env.NODE_ENV === 'development';

/**
 * Extract user email from Auth0 session for middleware
 * Returns null if not authenticated or in development (bypass mode)
 */
export async function getUserEmailFromSession(req: NextRequest): Promise<string | null> {
  // Development bypass: Return mock email
  if (!isAuthRequired()) {
    return 'dev@prepflow.org';
  }

  try {
    const session = await auth0.getSession(req);
    return session?.user?.email || null;
  } catch (error) {
    // Session not available or error
    return null;
  }
}

/**
 * Extract user roles from Auth0 session for middleware
 * Returns empty array if not authenticated or in development (bypass mode)
 */
export async function getUserRolesFromSession(req: NextRequest): Promise<string[]> {
  // Development bypass: Return admin role
  if (!isAuthRequired()) {
    return ['admin'];
  }

  try {
    const session = await auth0.getSession(req);
    if (!session?.user) {
      return [];
    }

    const roles = (session.user as any)['https://prepflow.org/roles'] || [];
    return Array.isArray(roles) ? roles : [];
  } catch (error) {
    return [];
  }
}

/**
 * Check if user has admin role from Auth0 session
 */
export async function isUserAdmin(req: NextRequest): Promise<boolean> {
  // Development bypass: Always admin
  if (!isAuthRequired()) {
    return true;
  }

  const roles = await getUserRolesFromSession(req);
  return roles.includes('admin') || roles.includes('super_admin');
}

/**
 * Check if user email is allowed (for allowlist enforcement)
 */
export async function isUserEmailAllowed(req: NextRequest): Promise<boolean> {
  // Development bypass: Always allowed
  if (!isAuthRequired()) {
    return true;
  }

  const email = await getUserEmailFromSession(req);
  if (!email) {
    return false;
  }

  return isEmailAllowed(email);
}

/**
 * Get full user object from Auth0 session for middleware
 * Returns null if not authenticated
 */
export async function getUserFromSession(req: NextRequest): Promise<{
  email: string;
  name?: string;
  picture?: string;
  sub: string;
  roles: string[];
} | null> {
  // Development bypass: Return mock user
  if (!isAuthRequired()) {
    return {
      email: 'dev@prepflow.org',
      name: 'Dev User',
      picture: undefined,
      sub: 'dev|123',
      roles: ['admin'],
    };
  }

  try {
    const session = await auth0.getSession(req);
    if (!session?.user) {
      return null;
    }

    const roles = (session.user as any)['https://prepflow.org/roles'] || [];

    return {
      email: session.user.email || '',
      name: session.user.name,
      picture: session.user.picture,
      sub: session.user.sub || '',
      roles: Array.isArray(roles) ? roles : [],
    };
  } catch (error) {
    return null;
  }
}
