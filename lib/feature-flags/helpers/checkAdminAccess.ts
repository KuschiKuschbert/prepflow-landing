import { isAdmin as checkUserAdminRole, type AuthUser } from '@/lib/admin-utils';
import { isEmailAllowed } from '@/lib/allowlist';

/**
 * Check if user has admin access (all features enabled)
 */
export function checkAdminAccess(
  userId?: string,
  userEmail?: string,
  user?: AuthUser | unknown,
): boolean {
  // If user object is provided, check Auth0 roles first
  if (user && checkUserAdminRole(user as AuthUser)) {
    return true;
  }

  // Fallback to allowlist check
  if (userEmail && isEmailAllowed(userEmail)) {
    return true;
  }

  if (userId && userId.includes('@') && isEmailAllowed(userId)) {
    return true;
  }

  return false;
}
