/**
 * Notification preferences types
 */

export interface EmailPreferences {
  weeklyReports?: boolean;
  securityAlerts?: boolean;
  featureUpdates?: boolean;
  marketing?: boolean;
}

export interface InAppPreferences {
  personalityToasts?: boolean;
  arcadeSounds?: boolean;
  emailDigest?: 'daily' | 'weekly' | 'monthly' | 'never';
}

export interface NotificationPreferences {
  email?: EmailPreferences;
  inApp?: InAppPreferences;
}
