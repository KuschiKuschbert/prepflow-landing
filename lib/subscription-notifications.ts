import { supabaseAdmin } from './supabase';
import { logger } from './logger';

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

/**
 * Create a notification for a user.
 * Stores notification in database and can trigger in-app toast.
 *
 * @param {CreateNotificationParams} params - Notification parameters
 * @returns {Promise<string | null>} Notification ID or null if failed
 */
export async function createNotification(params: CreateNotificationParams): Promise<string | null> {
  if (!supabaseAdmin) {
    logger.warn('[Subscription Notifications] Supabase not available, cannot create notification');
    return null;
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('user_notifications')
      .insert({
        user_email: params.userEmail,
        type: params.type,
        title: params.title,
        message: params.message,
        action_url: params.actionUrl || null,
        action_label: params.actionLabel || null,
        expires_at: params.expiresAt?.toISOString() || null,
        metadata: params.metadata || null,
      })
      .select('id')
      .single();

    if (error) {
      logger.error('[Subscription Notifications] Failed to create notification:', {
        error: error.message,
        params,
      });
      return null;
    }

    logger.dev('[Subscription Notifications] Created notification:', {
      id: data.id,
      userEmail: params.userEmail,
      type: params.type,
    });

    return data.id;
  } catch (error) {
    logger.error('[Subscription Notifications] Unexpected error creating notification:', {
      error: error instanceof Error ? error.message : String(error),
      params,
    });
    return null;
  }
}

/**
 * Create subscription-related notifications.
 * Convenience functions for common subscription events.
 */
export const subscriptionNotifications = {
  /**
   * Notification when subscription is activated.
   */
  async subscriptionActivated(userEmail: string, tier: string): Promise<void> {
    await createNotification({
      userEmail,
      type: 'subscription',
      title: 'Subscription Activated',
      message: `Your ${tier} subscription is now active! Enjoy all the features.`,
      actionUrl: '/webapp/settings/billing',
      actionLabel: 'View Subscription',
    });
  },

  /**
   * Notification when payment succeeds.
   */
  async paymentSucceeded(userEmail: string, amount?: number): Promise<void> {
    await createNotification({
      userEmail,
      type: 'billing',
      title: 'Payment Successful',
      message: amount
        ? `Your payment of $${amount.toFixed(2)} was processed successfully.`
        : 'Your payment was processed successfully.',
      actionUrl: '/webapp/settings/billing',
      actionLabel: 'View Billing',
    });
  },

  /**
   * Notification when payment fails.
   */
  async paymentFailed(userEmail: string): Promise<void> {
    await createNotification({
      userEmail,
      type: 'billing',
      title: 'Payment Failed',
      message:
        'Your payment could not be processed. Please update your payment method to continue using PrepFlow.',
      actionUrl: '/webapp/settings/billing',
      actionLabel: 'Update Payment',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Expires in 7 days
    });
  },

  /**
   * Notification when subscription is cancelled.
   */
  async subscriptionCancelled(
    userEmail: string,
    cancelAtPeriodEnd: boolean,
    expiresAt?: Date,
  ): Promise<void> {
    await createNotification({
      userEmail,
      type: 'subscription',
      title: cancelAtPeriodEnd ? 'Cancellation Scheduled' : 'Subscription Cancelled',
      message: cancelAtPeriodEnd
        ? expiresAt
          ? `Your subscription will be cancelled on ${expiresAt.toLocaleDateString()}. You can reactivate it anytime before then.`
          : 'Your subscription is scheduled to cancel at the end of your billing period. You can reactivate it anytime before then.'
        : 'Your subscription has been cancelled. You can reactivate it anytime.',
      actionUrl: '/webapp/settings/billing',
      actionLabel: 'Manage Subscription',
      expiresAt: expiresAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Expires in 30 days
    });
  },

  /**
   * Notification when subscription is expiring soon.
   */
  async subscriptionExpiringSoon(
    userEmail: string,
    daysRemaining: number,
    expiresAt: Date,
  ): Promise<void> {
    await createNotification({
      userEmail,
      type: 'subscription',
      title: `Subscription Expiring in ${daysRemaining} Day${daysRemaining > 1 ? 's' : ''}`,
      message: `Your subscription expires on ${expiresAt.toLocaleDateString()}. Renew now to avoid interruption.`,
      actionUrl: '/webapp/settings/billing',
      actionLabel: 'Renew Subscription',
      expiresAt: expiresAt,
    });
  },

  /**
   * Notification when subscription is reactivated.
   */
  async subscriptionReactivated(userEmail: string): Promise<void> {
    await createNotification({
      userEmail,
      type: 'subscription',
      title: 'Subscription Reactivated',
      message: 'Your subscription has been reactivated successfully. Welcome back!',
      actionUrl: '/webapp/settings/billing',
      actionLabel: 'View Subscription',
    });
  },
};

/**
 * Clean up expired notifications.
 * Should be called periodically (e.g., via cron job or background task).
 */
export async function cleanupExpiredNotifications(): Promise<number> {
  if (!supabaseAdmin) {
    logger.warn(
      '[Subscription Notifications] Supabase not available, cannot cleanup notifications',
    );
    return 0;
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('user_notifications')
      .delete()
      .lt('expires_at', new Date().toISOString())
      .select('id');

    if (error) {
      logger.error('[Subscription Notifications] Failed to cleanup expired notifications:', {
        error: error.message,
      });
      return 0;
    }

    const count = data?.length || 0;
    if (count > 0) {
      logger.dev('[Subscription Notifications] Cleaned up expired notifications:', { count });
    }

    return count;
  } catch (error) {
    logger.error('[Subscription Notifications] Unexpected error cleaning up notifications:', {
      error: error instanceof Error ? error.message : String(error),
    });
    return 0;
  }
}
