import type { AnalyticsEvent } from '../types';

export function trackPageView(
  sessionId: string,
  userId: string | undefined,
  events: AnalyticsEvent[],
  sendToAnalytics: (event: AnalyticsEvent) => void,
): void {
  const event: AnalyticsEvent = {
    action: 'page_view',
    category: 'navigation',
    timestamp: Date.now(),
    sessionId,
    userId,
    page: window.location.pathname,
    referrer: document.referrer,
    userAgent: navigator.userAgent,
  };
  events.push(event);
  sendToAnalytics(event);
}
