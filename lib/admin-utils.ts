import { logger } from '@/lib/logger';
/**
 * Admin role checking utilities (pure functions, no dependencies)
 * Extracted from admin-auth.ts to avoid importing authOptions in middleware
 */

export interface AuthUser {
  roles?: string[];
  role?: string;
  app_metadata?: { roles?: string[] };
  user_metadata?: { roles?: string[] };
  'https://prepflow.org/roles'?: string[];
  'https://prepflow.org/custom'?: { roles?: string[] };
  [key: string]: unknown;
}

/**
 * Check if a user has admin role from Auth0.
 * Auth0 roles are typically stored in the token's roles array or in user metadata.
 *
 * @param {AuthUser | null | undefined} user - User object from session or token
 * @returns {boolean} True if user has admin or super_admin role
 */
export function isAdmin(user: AuthUser | null | undefined): boolean {
  if (!user) return false;

  try {
    // Check for roles in token (Auth0 typically stores roles here)
    const roles = user?.roles || user?.['https://prepflow.org/roles'] || [];

    // Check for admin role in various possible locations
    if (Array.isArray(roles)) {
      return roles.includes('admin') || roles.includes('super_admin');
    }

    // Check direct role property
    if (user?.role === 'admin' || user?.role === 'super_admin') {
      return true;
    }

    // Check Auth0 app_metadata or user_metadata (safely)
    const appMetadata = user?.app_metadata || {};
    const userMetadata = user?.user_metadata || {};
    const metadataRoles = appMetadata?.roles || userMetadata?.roles || [];

    if (Array.isArray(metadataRoles)) {
      return metadataRoles.includes('admin') || metadataRoles.includes('super_admin');
    }

    // Check for custom claims namespace (Auth0 custom claims)
    const customClaims = user?.['https://prepflow.org/custom'] || {};
    const customRoles = customClaims?.roles || [];
    if (Array.isArray(customRoles)) {
      return customRoles.includes('admin') || customRoles.includes('super_admin');
    }
  } catch (error) {
    logger.error('[admin-utils.ts] Error in catch block:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    // If there's any error accessing user properties, return false
    return false;
  }

  return false;
}
