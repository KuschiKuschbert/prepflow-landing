/**
 * Security Breach Detection Utilities
 * Detects potential security breaches and suspicious activity patterns
 */

import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

export type BreachType =
  | 'unauthorized_access'
  | 'data_leak'
  | 'system_compromise'
  | 'credential_compromise'
  | 'suspicious_activity'
  | 'other';

export interface BreachDetectionResult {
  isBreach: boolean;
  breachType?: BreachType;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  affectedUsers: string[];
  metadata?: Record<string, unknown>;
}

/**
 * Detect potential breaches from authentication failures
 * @param userEmail - User email to check
 * @param failureCount - Number of recent failures
 * @param timeWindowMinutes - Time window in minutes
 * @returns Detection result
 */
export function detectAuthFailureBreach(
  userEmail: string,
  failureCount: number,
  timeWindowMinutes: number = 15,
): BreachDetectionResult {
  // Threshold: 5+ failures in 15 minutes suggests brute force or credential compromise
  const threshold = 5;
  const isBreach = failureCount >= threshold;

  return {
    isBreach,
    breachType: isBreach ? 'credential_compromise' : undefined,
    severity: isBreach ? 'medium' : 'low',
    description: isBreach
      ? `Multiple authentication failures detected for ${userEmail}: ${failureCount} failures in ${timeWindowMinutes} minutes`
      : `Normal authentication activity for ${userEmail}`,
    affectedUsers: isBreach ? [userEmail] : [],
    metadata: {
      failureCount,
      timeWindowMinutes,
      threshold,
    },
  };
}

/**
 * Detect potential breaches from suspicious access patterns
 * @param userEmail - User email to check
 * @param accessPatterns - Access pattern data
 * @returns Detection result
 */
export function detectSuspiciousAccessBreach(
  userEmail: string,
  accessPatterns: {
    ipAddresses: string[];
    userAgents: string[];
    locations: string[];
    timeRange: { start: Date; end: Date };
  },
): BreachDetectionResult {
  const uniqueIPs = new Set(accessPatterns.ipAddresses).size;
  const uniqueLocations = new Set(accessPatterns.locations).size;
  const timeSpanHours =
    (accessPatterns.timeRange.end.getTime() - accessPatterns.timeRange.start.getTime()) /
    (1000 * 60 * 60);

  // Suspicious patterns:
  // - Multiple IPs from different locations in short time (account sharing or compromise)
  // - Access from known malicious IP ranges
  const isSuspicious =
    (uniqueIPs >= 5 && uniqueLocations >= 3 && timeSpanHours < 24) || uniqueIPs >= 10;

  return {
    isBreach: isSuspicious,
    breachType: isSuspicious ? 'suspicious_activity' : undefined,
    severity: isSuspicious ? 'high' : 'low',
    description: isSuspicious
      ? `Suspicious access pattern detected for ${userEmail}: ${uniqueIPs} unique IPs from ${uniqueLocations} locations in ${timeSpanHours.toFixed(1)} hours`
      : `Normal access pattern for ${userEmail}`,
    affectedUsers: isSuspicious ? [userEmail] : [],
    metadata: {
      uniqueIPs,
      uniqueLocations,
      timeSpanHours,
      ipAddresses: accessPatterns.ipAddresses,
    },
  };
}

/**
 * Log a detected breach to the database
 * @param breach - Breach detection result
 * @returns Breach ID or null if failed
 */
export async function logBreach(breach: BreachDetectionResult): Promise<string | null> {
  if (!breach.isBreach || !breach.breachType) {
    return null;
  }

  if (!supabaseAdmin) {
    logger.error('[Breach Detection] Supabase not available, cannot log breach');
    return null;
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('security_breaches')
      .insert({
        breach_type: breach.breachType,
        description: breach.description,
        affected_users: breach.affectedUsers,
        status: 'pending',
        metadata: breach.metadata || {},
      })
      .select('id')
      .single();

    if (error) {
      logger.error('[Breach Detection] Failed to log breach:', {
        error: error.message,
        breach,
      });
      return null;
    }

    logger.warn('[Breach Detection] Breach logged:', {
      breachId: data.id,
      breachType: breach.breachType,
      severity: breach.severity,
      affectedUsers: breach.affectedUsers.length,
    });

    return data.id;
  } catch (error) {
    logger.error('[Breach Detection] Unexpected error logging breach:', {
      error: error instanceof Error ? error.message : String(error),
      breach,
    });
    return null;
  }
}

/**
 * Get breaches that need notification (detected within last 72 hours, status pending)
 * @returns Array of breach IDs that need notification
 */
export async function getBreachesNeedingNotification(): Promise<
  Array<{ id: string; detected_at: string; affected_users: string[] }>
> {
  if (!supabaseAdmin) {
    logger.warn('[Breach Detection] Supabase not available, cannot get breaches');
    return [];
  }

  try {
    // Get breaches detected within last 72 hours that are still pending notification
    const seventyTwoHoursAgo = new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString();

    const { data, error } = await supabaseAdmin
      .from('security_breaches')
      .select('id, detected_at, affected_users')
      .eq('status', 'pending')
      .gte('detected_at', seventyTwoHoursAgo)
      .order('detected_at', { ascending: true });

    if (error) {
      logger.error('[Breach Detection] Failed to get breaches needing notification:', {
        error: error.message,
      });
      return [];
    }

    return data || [];
  } catch (error) {
    logger.error('[Breach Detection] Unexpected error getting breaches:', {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}



