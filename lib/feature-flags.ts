/**
 * Feature flag system.
 * Manages feature flags stored in database with support for global and user-specific flags.
 */

import { checkAdminAccess } from './feature-flags/helpers/checkAdminAccess';
import { checkGlobalFlag } from './feature-flags/helpers/checkGlobalFlag';
import { checkUserFlag } from './feature-flags/helpers/checkUserFlag';
import { deleteFeatureFlag as deleteFeatureFlagHelper } from './feature-flags/helpers/deleteFeatureFlag';
import { getFeatureFlags as getFeatureFlagsHelper } from './feature-flags/helpers/getFeatureFlags';
import { setFeatureFlag as setFeatureFlagHelper } from './feature-flags/helpers/setFeatureFlag';

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
 */
export async function isFeatureEnabled(
  flagKey: string,
  userId?: string,
  userEmail?: string,
  user?: any,
): Promise<boolean> {
  if (checkAdminAccess(userId, userEmail, user)) {
    return true;
  }

  if (userId) {
    const userFlag = await checkUserFlag(flagKey, userId);
    if (userFlag.found) {
      return userFlag.enabled;
    }
  }

  return await checkGlobalFlag(flagKey);
}

export {
  deleteFeatureFlagHelper as deleteFeatureFlag,
  getFeatureFlagsHelper as getFeatureFlags,
  setFeatureFlagHelper as setFeatureFlag,
};
