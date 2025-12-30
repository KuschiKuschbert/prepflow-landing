/**
 * Subscription-related notification helpers.
 */
import { createNotification } from './helpers/createNotification';

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
        "Your payment couldn't be processed. Please update your payment method to continue using PrepFlow.",
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
