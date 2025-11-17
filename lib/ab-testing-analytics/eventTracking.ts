import { logger } from '@/lib/logger';
import type { ABTestEvent } from './types';

export function sendABTestEvent(event: ABTestEvent): void {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', event.eventType, {
      event_category: 'ab_testing',
      event_label: `${event.testId}_${event.variantId}`,
      value: event.eventValue,
      custom_parameter_test_id: event.testId,
      custom_parameter_variant_id: event.variantId,
      custom_parameter_user_id: event.userId,
      custom_parameter_session_id: event.sessionId,
      custom_parameter_metadata: JSON.stringify(event.metadata),
    });
  }
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: 'ab_test_event',
      event_category: 'ab_testing',
      event_label: `${event.testId}_${event.variantId}`,
      test_id: event.testId,
      variant_id: event.variantId,
      user_id: event.userId,
      session_id: event.sessionId,
      event_type: event.eventType,
      event_value: event.eventValue,
      metadata: event.metadata,
      timestamp: event.timestamp,
    });
  }
  if (process.env.NODE_ENV === 'development') {
    logger.dev('🧪 AB Test Event:', event);
  }
}
