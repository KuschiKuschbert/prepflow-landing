import { SessionManager } from './analytics/sessionManager';
import { trackPageView } from './analytics/trackers/pageViewTracker';
import { trackPerformance } from './analytics/trackers/performanceTracker';
import { trackUserInteractions } from './analytics/trackers/userInteractionTracker';
import { trackConversions } from './analytics/trackers/conversionTracker';
import {
  sendToAnalytics as sendAnalyticsEvent,
  sendConversion as sendConversionEvent,
  sendPerformanceMetrics as sendPerformanceEvent,
} from './analytics/senders/analyticsSender';
import type { AnalyticsEvent, ConversionEvent, PerformanceMetrics } from './analytics/types';

class PrepFlowAnalytics {
  private sessionManager: SessionManager;
  private events: AnalyticsEvent[] = [];
  private conversions: ConversionEvent[] = [];
  private performance: PerformanceMetrics[] = [];

  constructor() {
    this.sessionManager = new SessionManager();
    if (typeof window !== 'undefined') {
      this.initializeAnalytics();
    }
  }

  private initializeAnalytics(): void {
    trackPageView(
      this.sessionManager.getSessionId(),
      this.sessionManager.getUserId(),
      this.events,
      this.sendToAnalytics.bind(this),
    );
    trackPerformance(
      this.sessionManager.getSessionId(),
      this.performance,
      this.sendPerformanceMetrics.bind(this),
    );
    trackUserInteractions(
      this.sessionManager.getSessionId(),
      this.sessionManager.getUserId(),
      this.trackEvent.bind(this),
      this.trackConversion.bind(this),
    );
    trackConversions(
      this.sessionManager.getSessionId(),
      this.sessionManager.getUserId(),
      this.trackConversion.bind(this),
    );
  }

  public trackEvent(action: string, category: string, label?: string, value?: number): void {
    const event: AnalyticsEvent = {
      action,
      category,
      label,
      value,
      timestamp: Date.now(),
      sessionId: this.sessionManager.getSessionId(),
      userId: this.sessionManager.getUserId(),
      page: typeof window !== 'undefined' ? window.location.pathname : '/',
      referrer: typeof window !== 'undefined' ? document.referrer : undefined,
      userAgent: typeof window !== 'undefined' ? navigator.userAgent : undefined,
    };
    this.events.push(event);
    this.sendToAnalytics(event);
  }

  public trackConversion(conversion: ConversionEvent): void {
    this.conversions.push(conversion);
    this.sendConversion(conversion);
    this.trackEvent('conversion', 'business', conversion.type, 1);
  }

  public trackPerformanceMetrics(metrics: Partial<PerformanceMetrics>): void {
    const fullMetrics: PerformanceMetrics = {
      pageLoadTime: 0,
      firstContentfulPaint: 0,
      largestContentfulPaint: 0,
      firstInputDelay: 0,
      cumulativeLayoutShift: 0,
      timestamp: Date.now(),
      page: typeof window !== 'undefined' ? window.location.pathname : '/',
      sessionId: this.sessionManager.getSessionId(),
      ...metrics,
    };
    this.performance.push(fullMetrics);
    this.sendPerformanceMetrics(fullMetrics);
  }

  private sendToAnalytics(event: AnalyticsEvent): void {
    sendAnalyticsEvent(event);
  }

  private sendConversion(conversion: ConversionEvent): void {
    sendConversionEvent(conversion);
  }

  private sendPerformanceMetrics(metrics: PerformanceMetrics): void {
    sendPerformanceEvent(metrics);
  }

  public getSessionId(): string {
    return this.sessionManager.getSessionId();
  }

  public getUserId(): string | undefined {
    return this.sessionManager.getUserId();
  }

  public setUserId(userId: string): void {
    this.sessionManager.setUserId(userId);
  }

  public getEvents(): AnalyticsEvent[] {
    return [...this.events];
  }

  public getConversions(): ConversionEvent[] {
    return [...this.conversions];
  }

  public getPerformance(): PerformanceMetrics[] {
    return [...this.performance];
  }

  public exportData(): {
    sessionId: string;
    userId?: string;
    events: AnalyticsEvent[];
    conversions: ConversionEvent[];
    performance: PerformanceMetrics[];
  } {
    return {
      sessionId: this.sessionManager.getSessionId(),
      userId: this.sessionManager.getUserId(),
      events: this.events,
      conversions: this.conversions,
      performance: this.performance,
    };
  }
}

export const analytics = new PrepFlowAnalytics();
export const trackEvent = analytics.trackEvent.bind(analytics);
export const trackConversion = analytics.trackConversion.bind(analytics);
export const trackPerformance = analytics.trackPerformanceMetrics.bind(analytics);
export const getSessionId = analytics.getSessionId.bind(analytics);
export const setUserId = analytics.setUserId.bind(analytics);
export {
  assignVariant,
  getCurrentVariant,
  trackConversion as trackABConversion,
  trackEngagement,
  getTestResults,
  getActiveTests,
  getVariantInfo,
  getVariantAssignmentInfo,
} from './ab-testing-analytics';
export type { AnalyticsEvent, ConversionEvent, PerformanceMetrics } from './analytics/types';
