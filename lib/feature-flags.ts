/**
 * Feature flag system.
 * Manages feature flags stored in database with support for global and user-specific flags.
 */

import { supabaseAdmin } from './supabase';
import { isEmailAllowed } from './allowlist';
import { logger } from './logger';

export interface FeatureFlag {
  id: string;
  flag_key: string;
  enabled: boolean;
  user_id: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Check if a feature flag is enabled.
 * Checks user-specific flag first, then falls back to global flag.
 * Admin emails (in ALLOWED_EMAILS) automatically get access to all features.
 *
 * @param {string} flagKey - Feature flag key
 * @param {string} [userId] - Optional user ID for user-specific flags (can be email or UUID)
 * @param {string} [userEmail] - Optional user email for admin check
 * @returns {Promise<boolean>} True if feature is enabled
 */
export async function isFeatureEnabled(
  flagKey: string,
  userId?: string,
  userEmail?: string,
): Promise<boolean> {
  // Check if user email is in ALLOWED_EMAILS - admins get all features enabled
  if (userEmail && isEmailAllowed(userEmail)) {
    return true;
  }

  // Also check if userId is an email and is in ALLOWED_EMAILS
  if (userId && userId.includes('@') && isEmailAllowed(userId)) {
    return true;
  }

  if (!supabaseAdmin) {
    // Default to disabled if database not available
    return false;
  }

  try {
    // Check user-specific flag first if userId provided
    if (userId) {
      const { data: userFlag } = await supabaseAdmin
        .from('feature_flags')
        .select('enabled')
        .eq('flag_key', flagKey)
        .eq('user_id', userId)
        .single();

      if (userFlag) {
        return userFlag.enabled;
      }
    }

    // Fall back to global flag
    const { data: globalFlag } = await supabaseAdmin
      .from('feature_flags')
      .select('enabled')
      .eq('flag_key', flagKey)
      .is('user_id', null)
      .single();

    return globalFlag?.enabled || false;
  } catch (error) {
    // If flag doesn't exist, default to disabled
    return false;
  }
}

/**
 * Get all feature flags.
 *
 * @param {string} [userId] - Optional user ID to filter user-specific flags
 * @returns {Promise<FeatureFlag[]>} List of feature flags
 */
export async function getFeatureFlags(userId?: string): Promise<FeatureFlag[]> {
  if (!supabaseAdmin) {
    return [];
  }

  try {
    let query = supabaseAdmin.from('feature_flags').select('*').order('flag_key');

    if (userId) {
      query = query.or(`user_id.eq.${userId},user_id.is.null`);
    } else {
      query = query.is('user_id', null);
    }

    const { data, error } = await query;

    if (error) {
      logger.error('[Feature Flags] Error fetching flags:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    logger.error('[Feature Flags] Unexpected error:', error);
    return [];
  }
}

/**
 * Set a feature flag.
 *
 * @param {string} flagKey - Feature flag key
 * @param {boolean} enabled - Whether flag is enabled
 * @param {string} [userId] - Optional user ID for user-specific flag
 * @param {string} [description] - Optional description
 * @returns {Promise<FeatureFlag>} Updated feature flag
 */
export async function setFeatureFlag(
  flagKey: string,
  enabled: boolean,
  userId?: string,
  description?: string,
): Promise<FeatureFlag | null> {
  if (!supabaseAdmin) {
    return null;
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('feature_flags')
      .upsert(
        {
          flag_key: flagKey,
          enabled,
          user_id: userId || null,
          description: description || null,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'flag_key,user_id',
        },
      )
      .select()
      .single();

    if (error) {
      logger.error('[Feature Flags] Error setting flag:', error);
      return null;
    }

    return data;
  } catch (error) {
    logger.error('[Feature Flags] Unexpected error:', error);
    return null;
  }
}

/**
 * Delete a feature flag.
 *
 * @param {string} flagKey - Feature flag key
 * @param {string} [userId] - Optional user ID for user-specific flag
 * @returns {Promise<boolean>} True if deleted successfully
 */
export async function deleteFeatureFlag(flagKey: string, userId?: string): Promise<boolean> {
  if (!supabaseAdmin) {
    return false;
  }

  try {
    let query = supabaseAdmin.from('feature_flags').delete().eq('flag_key', flagKey);

    if (userId) {
      query = query.eq('user_id', userId);
    } else {
      query = query.is('user_id', null);
    }

    const { error } = await query;

    if (error) {
      logger.error('[Feature Flags] Error deleting flag:', error);
      return false;
    }

    return true;
  } catch (error) {
    logger.error('[Feature Flags] Unexpected error:', error);
    return false;
  }
}
