import { getDefaultPreferences } from './getDefaultPreferences';

/**
 * Merge preferences with defaults to ensure all fields exist
 */
export function mergePreferences(preferences: any) {
  const defaultPreferences = getDefaultPreferences();

  return {
    email: {
      ...defaultPreferences.email,
      ...(preferences?.email || {}),
    },
    inApp: {
      ...defaultPreferences.inApp,
      ...(preferences?.inApp || {}),
    },
  };
}
