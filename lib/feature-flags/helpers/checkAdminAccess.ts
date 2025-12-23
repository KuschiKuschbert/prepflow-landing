import { isEmailAllowed } from '@/lib/allowlist';

/**
 * Check if user has admin access (all features enabled)
 */
export function checkAdminAccess(userId?: string, userEmail?: string): boolean {
  if (userEmail && isEmailAllowed(userEmail)) {
    return true;
  }

  if (userId && userId.includes('@') && isEmailAllowed(userId)) {
    return true;
  }

  return false;
}

