import type { NotificationPreferences } from './types';

/**
 * Get default notification preferences
 */
export function getDefaultPreferences(): Required<NotificationPreferences> {
  return {
    email: {
      weeklyReports: true,
      securityAlerts: true,
      featureUpdates: true,
      marketing: false,
    },
    inApp: {
      personalityToasts: true,
      arcadeSounds: true,
      emailDigest: 'weekly' as const,
    },
  };
}
