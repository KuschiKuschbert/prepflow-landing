/**
 * Admin audit logging utilities.
 * Logs all admin actions to admin_audit_logs table for security and compliance.
 */
import { extractRequestMetadata } from './admin-audit/helpers/extractRequestMetadata';
import type { AdminUser } from './admin-auth';
import { logger } from './logger';
import { supabaseAdmin } from './supabase';

export interface AuditLogEntry {
  admin_user_id: string;
  admin_user_email: string;
  action: string;
  target_type?: string;
  target_id?: string;
  details?: Record<string, unknown>;
  ip_address?: string;
  user_agent?: string;
}

/**
 * Log an admin action to the audit log.
 * This is non-blocking and won't throw errors.
 *
 * @param {AuditLogEntry} entry - Audit log entry
 */
export async function logAdminAction(entry: AuditLogEntry): Promise<void> {
  // Run asynchronously to avoid blocking
  // Run asynchronously to avoid blocking
  // Use void operator to explicitly ignore the promise and allow execution in background
  void (async () => {
    try {
      if (!supabaseAdmin) {
        logger.warn('[Admin Audit] Supabase not available, skipping audit log');
        return;
      }

      const { error: insertError } = await supabaseAdmin.from('admin_audit_logs').insert({
        admin_user_id: entry.admin_user_id,
        admin_user_email: entry.admin_user_email,
        action: entry.action,
        target_type: entry.target_type || null,
        target_id: entry.target_id || null,
        details: entry.details || null,
        ip_address: entry.ip_address || null,
        user_agent: entry.user_agent || null,
      });

      if (insertError) {
        logger.error('[Admin Audit] Error inserting audit log:', {
          error: insertError.message,
          context: { operation: 'logAdminAction' },
        });
      }
    } catch (error) {
      // Silently fail - don't let audit logging break the app
      logger.error('[Admin Audit] Failed to log admin action:', {
        error: error instanceof Error ? error.message : String(error),
        action: entry.action,
      });
    }
  })();
}

/**
 * Log admin action from API route. Extracts IP and user agent from request.
 */
export async function logAdminApiAction(
  adminUser: AdminUser,
  action: string,
  request: { headers: Headers },
  options: {
    target_type?: string;
    target_id?: string;
    details?: Record<string, unknown>;
  } = {},
): Promise<void> {
  const { ipAddress, userAgent } = extractRequestMetadata(request);
  await logAdminAction({
    admin_user_id: adminUser.id,
    admin_user_email: adminUser.email,
    action,
    target_type: options.target_type,
    target_id: options.target_id,
    details: options.details,
    ip_address: ipAddress,
    user_agent: userAgent,
  });
}

/** Log tier configuration change. */
export async function logTierConfigChange(
  adminEmail: string,
  tier: string,
  changes: Record<string, unknown>,
  request?: { headers: Headers },
): Promise<void> {
  const { ipAddress, userAgent } = extractRequestMetadata(request);
  await logAdminAction({
    admin_user_id: adminEmail,
    admin_user_email: adminEmail,
    action: 'tier_config_updated',
    target_type: 'tier_configuration',
    target_id: tier,
    details: { tier, changes },
    ip_address: ipAddress,
    user_agent: userAgent,
  });
}

/** Log feature tier mapping change. */
export async function logFeatureTierChange(
  adminEmail: string,
  featureKey: string,
  oldTier: string,
  newTier: string,
  request?: { headers: Headers },
): Promise<void> {
  const { ipAddress, userAgent } = extractRequestMetadata(request);
  await logAdminAction({
    admin_user_id: adminEmail,
    admin_user_email: adminEmail,
    action: 'feature_tier_updated',
    target_type: 'feature_tier_mapping',
    target_id: featureKey,
    details: { featureKey, oldTier, newTier },
    ip_address: ipAddress,
    user_agent: userAgent,
  });
}

/** Log cache invalidation. */
export async function logCacheInvalidation(
  adminEmail: string,
  request?: { headers: Headers },
): Promise<void> {
  const { ipAddress, userAgent } = extractRequestMetadata(request);
  await logAdminAction({
    admin_user_id: adminEmail,
    admin_user_email: adminEmail,
    action: 'tier_cache_invalidated',
    target_type: 'cache',
    details: { cacheType: 'tier_configs' },
    ip_address: ipAddress,
    user_agent: userAgent,
  });
}
