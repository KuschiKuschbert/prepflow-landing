/**
 * Feature flag descriptions mapping.
 * Provides human-readable descriptions for feature flags.
 */

export const FEATURE_FLAG_DESCRIPTIONS: Record<string, string> = {
  'kitchen-staff':
    'Kitchen Staff management feature - Manage employee information, roles, and schedules. Controls visibility of the "Kitchen Staff" navigation item.',
  roster:
    'Roster Builder feature - Create and manage staff rosters and schedules. Controls visibility of the "Roster" navigation item.',
};

/**
 * Get description for a feature flag.
 *
 * @param {string} flagKey - Feature flag key
 * @returns {string | null} Description if available, null otherwise
 */
export function getFeatureFlagDescription(flagKey: string): string | null {
  return FEATURE_FLAG_DESCRIPTIONS[flagKey] || null;
}

