import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { isAdmin } from '../admin-utils';
import { getAdminRole } from './roles';
import type { AdminUser } from './types';

/**
 * Get admin user info from session.
 * Use this in server components and API routes.
 *
 * @returns {Promise<AdminUser | null>} Admin user info or null if not admin
 */
export async function getAdminUser(req?: NextRequest): Promise<AdminUser | null> {
  if (!req) {
    // If no request provided, return null (can't get session without request)
    return null;
  }
  const { auth0 } = await import('@/lib/auth0');
  const session = await auth0.getSession(req);
  if (!session?.user) return null;

  const role = getAdminRole(session.user);
  if (!role) return null;

  return {
    id: session.user.email || '',
    email: session.user.email || '',
    role,
  };
}

/**
 * Require admin access - throws error if user is not admin.
 * Use this in API routes to protect admin endpoints.
 *
 * @param {NextRequest} request - Next.js request object
 * @returns {Promise<AdminUser>} Admin user info
 * @throws {NextResponse} 401 or 403 response if not admin
 */
export async function requireAdmin(request: NextRequest): Promise<AdminUser> {
  const { auth0 } = await import('@/lib/auth0');
  const session = await auth0.getSession(request);

  if (!session?.user) {
    throw NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!isAdmin(session.user)) {
    throw NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
  }

  const role = getAdminRole(session.user) || 'admin';

  return {
    id: session.user.email || session.user.sub || '',
    email: session.user.email || '',
    role,
  };
}

/**
 * Check if current session user is admin (for client-side checks).
 * Note: This should be used carefully - always verify on server side.
 *
 * @param {NextRequest} req - Next.js request object (required for server-side checks)
 * @returns {Promise<boolean>} True if current user is admin
 */
export async function checkIsAdmin(req?: NextRequest): Promise<boolean> {
  if (!req) {
    // Can't check admin status without request
    return false;
  }
  const { auth0 } = await import('@/lib/auth0');
  const session = await auth0.getSession(req);
  if (!session?.user) return false;
  return isAdmin(session.user);
}
