/**
 * Admin authentication utilities.
 * Handles admin role checking and authorization for admin panel access.
 */

import { auth0 } from './auth0';
import { isAdmin } from './admin-utils';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export type AdminRole = 'admin' | 'super_admin';

export interface AdminUser {
  id: string;
  email: string;
  role: AdminRole;
}

// Re-export isAdmin for backward compatibility
export { isAdmin };

/**
 * Get admin role level from user object.
 *
 * @param {any} user - User object from session or token
 * @returns {AdminRole | null} Admin role level or null if not admin
 */
export function getAdminRole(user: any): AdminRole | null {
  if (!isAdmin(user)) return null;

  const roles = user.roles || user['https://prepflow.org/roles'] || [];

  if (Array.isArray(roles)) {
    if (roles.includes('super_admin')) return 'super_admin';
    if (roles.includes('admin')) return 'admin';
  }

  if (user.role === 'super_admin') return 'super_admin';
  if (user.role === 'admin') return 'admin';

  const appMetadata = user.app_metadata || {};
  const userMetadata = user.user_metadata || {};
  const metadataRoles = appMetadata.roles || userMetadata.roles || [];

  if (Array.isArray(metadataRoles)) {
    if (metadataRoles.includes('super_admin')) return 'super_admin';
    if (metadataRoles.includes('admin')) return 'admin';
  }

  return null;
}

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
