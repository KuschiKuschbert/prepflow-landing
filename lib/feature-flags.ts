/**
 * Feature flag system.
 * Manages feature flags stored in database with support for global and user-specific flags.
 */

import { checkAdminAccess } from './feature-flags/helpers/checkAdminAccess';
import { checkUserFlag } from './feature-flags/helpers/checkUserFlag';
import { checkGlobalFlag } from './feature-flags/helpers/checkGlobalFlag';
import { getFeatureFlags as getFeatureFlagsHelper } from './feature-flags/helpers/getFeatureFlags';
import { setFeatureFlag as setFeatureFlagHelper } from './feature-flags/helpers/setFeatureFlag';
import { deleteFeatureFlag as deleteFeatureFlagHelper } from './feature-flags/helpers/deleteFeatureFlag';

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
): Promise<boolean> {
  if (checkAdminAccess(userId, userEmail)) {
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

export { getFeatureFlagsHelper as getFeatureFlags };
export { setFeatureFlagHelper as setFeatureFlag };
export { deleteFeatureFlagHelper as deleteFeatureFlag };
