import { AuthUser, isAdmin } from '../admin-utils';
import type { AdminRole } from './types';

/**
 * Get admin role level from user object.
 *
 * @param {AuthUser} user - User object from session or token
 * @returns {AdminRole | null} Admin role level or null if not admin
 */
export function getAdminRole(user: AuthUser): AdminRole | null {
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
