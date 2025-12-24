/**
 * Subscription notifications service.
 */
import { createNotification } from './subscription-notifications/helpers/createNotification';
import { subscriptionNotifications } from './subscription-notifications/subscriptionNotifications';
import { cleanupExpiredNotifications } from './subscription-notifications/helpers/cleanupExpiredNotifications';

// Export types
export type {
  NotificationType,
  CreateNotificationParams,
} from './subscription-notifications/types';

// Re-export functions
export { createNotification, subscriptionNotifications, cleanupExpiredNotifications };
