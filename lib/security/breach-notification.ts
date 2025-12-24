/**
 * Security Breach Notification System
 * Sends notifications to affected users within 72 hours of breach detection
 */

import type { BreachNotificationData } from './breach-notification/helpers/sendBreachEmail';

export type { BreachNotificationData };

// Re-export main functions
export { notifyBreachAffectedUsers } from './breach-notification/helpers/notifyAffectedUsers';
export { updateBreachNotificationStatus } from './breach-notification/helpers/updateBreachStatus';
export { processPendingBreachNotifications } from './breach-notification/helpers/processPendingBreaches';
