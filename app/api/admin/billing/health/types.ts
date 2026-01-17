export interface HealthReport {
  usersWithMissingSubscriptions: string[];
  subscriptionsWithMissingUsers: string[];
  mismatchedStatuses: Array<{ email: string; dbStatus: string; stripeStatus: string }>;
  totalUsers: number;
  totalSubscriptions: number;
  healthy: boolean;
}

export interface UserSubscriptionCheckResult {
  mismatchedStatuses: Array<{ email: string; dbStatus: string; stripeStatus: string }>;
  usersWithMissingSubscriptions: string[];
  healthy: boolean;
}

export interface OrphanedSubscriptionCheckResult {
  subscriptionsWithMissingUsers: string[];
  healthy: boolean;
}
