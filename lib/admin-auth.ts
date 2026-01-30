/**
 * Admin authentication utilities.
 * Handles admin role checking and authorization for admin panel access.
 */

import { resolveAdminUserId, standardAdminChecks } from './admin-auth/check-utils';
import { getAdminRole } from './admin-auth/roles';
import { checkIsAdmin, getAdminUser, requireAdmin } from './admin-auth/session';
import type { AdminRole, AdminUser, SupabaseAdmin } from './admin-auth/types';
import { AuthUser, isAdmin } from './admin-utils';

// Re-export isAdmin and AuthUser for backward compatibility
export { isAdmin };
export type { AuthUser };

// Export everything from new modules
export {
  checkIsAdmin,
  getAdminRole,
  getAdminUser,
  requireAdmin,
  resolveAdminUserId,
  standardAdminChecks,
};
export type { AdminRole, AdminUser, SupabaseAdmin };
