import { getDefaultPreferences } from './getDefaultPreferences';
import type { NotificationPreferences } from './types';

/**
 * Merge preferences with defaults to ensure all fields exist
 */
export function mergePreferences(
  preferences: NotificationPreferences,
): Required<NotificationPreferences> {
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
