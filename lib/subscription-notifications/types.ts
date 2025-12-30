/**
 * Subscription notifications types.
 */
export type NotificationType = 'subscription' | 'system' | 'billing';

export interface CreateNotificationParams {
  userEmail: string;
  type: NotificationType;
  title: string;
  message: string;
  actionUrl?: string;
  actionLabel?: string;
  expiresAt?: Date;
  metadata?: Record<string, unknown>;
}


