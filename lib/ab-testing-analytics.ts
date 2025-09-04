// PrepFlow A/B Testing Analytics
// Tracks variant performance, user behavior, and statistical significance

export interface ABTestVariant {
  id: string;
  name: string;
  description: string;
  trafficSplit: number; // Percentage of traffic (0-100)
  isControl: boolean;
}

export interface ABTestEvent {
  testId: string;
  variantId: string;
  userId: string;
  sessionId: string;
  eventType: 'variant_assigned' | 'page_view' | 'conversion' | 'engagement';
  eventValue?: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

export interface ABTestResult {
  testId: string;
  variantId: string;
  totalUsers: number;
  conversions: number;
  conversionRate: number;
  averageOrderValue?: number;
  revenue?: number;
  statisticalSignificance?: number;
}

class ABTestingAnalytics {
  private tests: Map<string, ABTestVariant[]> = new Map();
  private events: ABTestEvent[] = [];
  private userVariants: Map<string, string> = new Map(); // userId -> variantId

  constructor() {
    this.initializeDefaultTests();
  }

  private initializeDefaultTests(): void {
    // Define your A/B test variants
    this.addTest('landing_page_variants', [
      { id: 'control', name: 'Control', description: 'Original landing page', trafficSplit: 25, isControl: true },
      { id: 'variant_a', name: 'Variant A', description: 'Alternative hero section', trafficSplit: 25, isControl: false },
      { id: 'variant_b', name: 'Variant B', description: 'Different pricing layout', trafficSplit: 25, isControl: false },
      { id: 'variant_c', name: 'Variant C', description: 'New CTA positioning', trafficSplit: 25, isControl: false },
    ]);
  }

  public addTest(testId: string, variants: ABTestVariant[]): void {
    this.tests.set(testId, variants);
  }

  public assignVariant(testId: string, userId: string): string {
    const variants = this.tests.get(testId);
    if (!variants) {
      console.warn(`AB test ${testId} not found`);
      return 'control';
    }

    // Check for existing persistent variant assignment
    const persistentVariant = this.getPersistentVariant(userId);
    if (persistentVariant) {
      return persistentVariant;
    }

    // Assign new persistent variant based on traffic split
    const assignedVariant = this.assignNewPersistentVariant(testId, userId, variants);
    
    // Track variant assignment
    this.trackEvent({
      testId,
      variantId: assignedVariant,
      userId,
      sessionId: this.getSessionId(),
      eventType: 'variant_assigned',
      timestamp: Date.now(),
      metadata: { 
        variant_name: variants.find(v => v.id === assignedVariant)?.name || assignedVariant, 
        is_control: assignedVariant === 'control',
        assignment_type: 'persistent',
        rotation_period: '1_month'
      }
    });

    return assignedVariant;
  }

  private getPersistentVariant(userId: string): string | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const stored = localStorage.getItem(`prepflow_variant_${userId}`);
      if (!stored) return null;
      
      const variantData = JSON.parse(stored);
      const assignmentDate = new Date(variantData.assignedAt);
      const currentDate = new Date();
      const daysSinceAssignment = (currentDate.getTime() - assignmentDate.getTime()) / (1000 * 60 * 60 * 24);
      
      // If less than 30 days, return the assigned variant
      if (daysSinceAssignment < 30) {
        return variantData.variantId;
      }
      
      // If more than 30 days, clear the assignment for rotation
      localStorage.removeItem(`prepflow_variant_${userId}`);
      return null;
    } catch (error) {
      console.warn('Error reading persistent variant:', error);
      return null;
    }
  }

  private assignNewPersistentVariant(testId: string, userId: string, variants: ABTestVariant[]): string {
    // Assign variant based on traffic split
    const random = Math.random() * 100;
    let cumulativeSplit = 0;
    
    for (const variant of variants) {
      cumulativeSplit += variant.trafficSplit;
      if (random <= cumulativeSplit) {
        const assignedVariant = variant.id;
        
        // Store persistent assignment
        this.storePersistentVariant(userId, assignedVariant);
        
        return assignedVariant;
      }
    }

    // Fallback to control
    const assignedVariant = 'control';
    this.storePersistentVariant(userId, assignedVariant);
    return assignedVariant;
  }

  private storePersistentVariant(userId: string, variantId: string): void {
    if (typeof window === 'undefined') return;
    
    try {
      const variantData = {
        variantId,
        assignedAt: new Date().toISOString(),
        testId: 'landing_page_variants'
      };
      
      localStorage.setItem(`prepflow_variant_${userId}`, JSON.stringify(variantData));
    } catch (error) {
      console.warn('Error storing persistent variant:', error);
    }
  }

  public getCurrentVariant(testId: string, userId: string): string {
    return this.assignVariant(testId, userId);
  }

  public trackEvent(event: ABTestEvent): void {
    this.events.push(event);
    
    // Send to Google Analytics with variant context
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

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('🧪 AB Test Event:', event);
    }
  }

  public trackConversion(testId: string, userId: string, value?: number, metadata?: Record<string, any>): void {
    const variantId = this.getCurrentVariant(testId, userId);
    
    this.trackEvent({
      testId,
      variantId,
      userId,
      sessionId: this.getSessionId(),
      eventType: 'conversion',
      eventValue: value,
      timestamp: Date.now(),
      metadata
    });
  }

  public trackEngagement(testId: string, userId: string, engagementType: string, metadata?: Record<string, any>): void {
    const variantId = this.getCurrentVariant(testId, userId);
    
    this.trackEvent({
      testId,
      variantId,
      userId,
      sessionId: this.getSessionId(),
      eventType: 'engagement',
      timestamp: Date.now(),
      metadata: { engagement_type: engagementType, ...metadata }
    });
  }

  public getTestResults(testId: string): ABTestResult[] {
    const variants = this.tests.get(testId);
    if (!variants) return [];

    const results: ABTestResult[] = [];
    
    for (const variant of variants) {
      const variantEvents = this.events.filter(e => 
        e.testId === testId && e.variantId === variant.id
      );
      
      const totalUsers = new Set(variantEvents.map(e => e.userId)).size;
      const conversions = variantEvents.filter(e => e.eventType === 'conversion').length;
      const conversionRate = totalUsers > 0 ? (conversions / totalUsers) * 100 : 0;
      
      const conversionEvents = variantEvents.filter(e => e.eventType === 'conversion');
      const totalValue = conversionEvents.reduce((sum, e) => sum + (e.eventValue || 0), 0);
      const averageOrderValue = conversions > 0 ? totalValue / conversions : 0;
      
      results.push({
        testId,
        variantId: variant.id,
        totalUsers,
        conversions,
        conversionRate,
        averageOrderValue,
        revenue: totalValue,
        statisticalSignificance: this.calculateStatisticalSignificance(testId, variant.id)
      });
    }

    return results.sort((a, b) => b.conversionRate - a.conversionRate);
  }

  private calculateStatisticalSignificance(testId: string, variantId: string): number {
    // Simplified statistical significance calculation
    // In production, you'd want to use a proper statistical library
    const variantEvents = this.events.filter(e => 
      e.testId === testId && e.variantId === variantId
    );
    const controlEvents = this.events.filter(e => 
      e.testId === testId && e.variantId === 'control'
    );
    
    const variantConversions = variantEvents.filter(e => e.eventType === 'conversion').length;
    const variantTotal = variantEvents.length;
    const controlConversions = controlEvents.filter(e => e.eventType === 'conversion').length;
    const controlTotal = controlEvents.length;
    
    if (variantTotal === 0 || controlTotal === 0) return 0;
    
    const variantRate = variantConversions / variantTotal;
    const controlRate = controlConversions / controlTotal;
    
    // Basic significance calculation (simplified)
    const difference = Math.abs(variantRate - controlRate);
    const significance = Math.min(difference * 100, 100); // 0-100 scale
    
    return Math.round(significance);
  }

  private getSessionId(): string {
    // Generate or retrieve session ID
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('prepflow_session_id') || 
             'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    return 'server_session_' + Date.now();
  }

  public exportData(): {
    tests: Map<string, ABTestVariant[]>;
    events: ABTestEvent[];
    userVariants: Map<string, string>;
  } {
    return {
      tests: this.tests,
      events: this.events,
      userVariants: this.userVariants
    };
  }

  public getActiveTests(): string[] {
    return Array.from(this.tests.keys());
  }

  public getVariantInfo(testId: string, variantId: string): ABTestVariant | undefined {
    const variants = this.tests.get(testId);
    return variants?.find(v => v.id === variantId);
  }

  public getVariantAssignmentInfo(userId: string): {
    variantId: string;
    assignedAt: string;
    daysRemaining: number;
    isPersistent: boolean;
  } | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const stored = localStorage.getItem(`prepflow_variant_${userId}`);
      if (!stored) return null;
      
      const variantData = JSON.parse(stored);
      const assignmentDate = new Date(variantData.assignedAt);
      const currentDate = new Date();
      const daysSinceAssignment = (currentDate.getTime() - assignmentDate.getTime()) / (1000 * 60 * 60 * 24);
      const daysRemaining = Math.max(0, 30 - daysSinceAssignment);
      
      return {
        variantId: variantData.variantId,
        assignedAt: variantData.assignedAt,
        daysRemaining: Math.round(daysRemaining),
        isPersistent: daysRemaining > 0
      };
    } catch (error) {
      console.warn('Error reading variant assignment info:', error);
      return null;
    }
  }
}

// Create singleton instance
export const abTestingAnalytics = new ABTestingAnalytics();

// Export individual functions for easy use
export const assignVariant = abTestingAnalytics.assignVariant.bind(abTestingAnalytics);
export const getCurrentVariant = abTestingAnalytics.getCurrentVariant.bind(abTestingAnalytics);
export const trackConversion = abTestingAnalytics.trackConversion.bind(abTestingAnalytics);
export const trackEngagement = abTestingAnalytics.trackEngagement.bind(abTestingAnalytics);
export const getTestResults = abTestingAnalytics.getTestResults.bind(abTestingAnalytics);
export const getActiveTests = abTestingAnalytics.getActiveTests.bind(abTestingAnalytics);
export const getVariantInfo = abTestingAnalytics.getVariantInfo.bind(abTestingAnalytics);
export const getVariantAssignmentInfo = abTestingAnalytics.getVariantAssignmentInfo.bind(abTestingAnalytics);
