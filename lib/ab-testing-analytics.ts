import { getDefaultTests } from './ab-testing-analytics/defaultTests';
import { sendABTestEvent } from './ab-testing-analytics/eventTracking';
import { getSessionId } from './ab-testing-analytics/sessionManager';
import { calculateTestResults } from './ab-testing-analytics/testResults';
import type { ABTestEvent, ABTestResult, ABTestVariant, JsonValue } from './ab-testing-analytics/types';
import { assignVariant as assignVariantHelper } from './ab-testing-analytics/variantAssignment';
import {
    getVariantAssignmentInfo as getVariantAssignmentInfoHelper,
    getVariantInfo as getVariantInfoHelper,
} from './ab-testing-analytics/variantInfo';

class ABTestingAnalytics {
  private tests: Map<string, ABTestVariant[]> = new Map();
  private events: ABTestEvent[] = [];
  private userVariants: Map<string, string> = new Map();

  constructor() {
    this.tests = getDefaultTests();
  }

  public addTest(testId: string, variants: ABTestVariant[]): void {
    this.tests.set(testId, variants);
  }

  public assignVariant(testId: string, userId: string): string {
    const variants = this.tests.get(testId);
    return assignVariantHelper(
      testId,
      userId,
      variants,
      this.getSessionId.bind(this),
      this.trackEvent.bind(this),
    );
  }

  public getCurrentVariant(testId: string, userId: string): string {
    return this.assignVariant(testId, userId);
  }

  public trackEvent(event: ABTestEvent): void {
    this.events.push(event);
    sendABTestEvent(event);
  }

  public trackConversion(
    testId: string,
    userId: string,
    value?: number,
    metadata?: Record<string, JsonValue>,
  ): void {
    const variantId = this.getCurrentVariant(testId, userId);
    this.trackEvent({
      testId,
      variantId,
      userId,
      sessionId: this.getSessionId(),
      eventType: 'conversion',
      eventValue: value,
      timestamp: Date.now(),
      metadata,
    });
  }

  public trackEngagement(
    testId: string,
    userId: string,
    engagementType: string,
    metadata?: Record<string, JsonValue>,
  ): void {
    const variantId = this.getCurrentVariant(testId, userId);
    this.trackEvent({
      testId,
      variantId,
      userId,
      sessionId: this.getSessionId(),
      eventType: 'engagement',
      timestamp: Date.now(),
      metadata: { engagement_type: engagementType, ...metadata },
    });
  }

  public getTestResults(testId: string): ABTestResult[] {
    const variants = this.tests.get(testId);
    if (!variants) return [];
    return calculateTestResults(testId, variants, this.events);
  }

  private getSessionId(): string {
    return getSessionId();
  }

  public exportData(): {
    tests: Map<string, ABTestVariant[]>;
    events: ABTestEvent[];
    userVariants: Map<string, string>;
  } {
    return {
      tests: this.tests,
      events: this.events,
      userVariants: this.userVariants,
    };
  }

  public getActiveTests(): string[] {
    return Array.from(this.tests.keys());
  }

  public getVariantInfo(testId: string, variantId: string): ABTestVariant | undefined {
    const variants = this.tests.get(testId);
    return getVariantInfoHelper(variants, variantId);
  }

  public getVariantAssignmentInfo(userId: string): {
    variantId: string;
    assignedAt: string;
    daysRemaining: number;
    isPersistent: boolean;
  } | null {
    return getVariantAssignmentInfoHelper(userId);
  }
}

export const abTestingAnalytics = new ABTestingAnalytics();
export const assignVariant = abTestingAnalytics.assignVariant.bind(abTestingAnalytics);
export const getCurrentVariant = abTestingAnalytics.getCurrentVariant.bind(abTestingAnalytics);
export const trackConversion = abTestingAnalytics.trackConversion.bind(abTestingAnalytics);
export const trackEngagement = abTestingAnalytics.trackEngagement.bind(abTestingAnalytics);
export const getTestResults = abTestingAnalytics.getTestResults.bind(abTestingAnalytics);
export const getActiveTests = abTestingAnalytics.getActiveTests.bind(abTestingAnalytics);
// Export class method bindings (not the helper functions from variantInfo.ts)
export const getVariantInfo = abTestingAnalytics.getVariantInfo.bind(abTestingAnalytics);
export const getVariantAssignmentInfo =
  abTestingAnalytics.getVariantAssignmentInfo.bind(abTestingAnalytics);
export type { ABTestEvent, ABTestResult, ABTestVariant } from './ab-testing-analytics/types';

// Explicitly do NOT re-export the helper functions to avoid conflicts
// The helper functions (getVariantInfoHelper, getVariantAssignmentInfoHelper) are internal only
