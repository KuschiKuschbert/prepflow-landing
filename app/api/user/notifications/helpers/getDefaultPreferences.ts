/**
 * Get default notification preferences
 */
export function getDefaultPreferences() {
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
