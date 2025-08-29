// PrepFlow Analytics Service
// Tracks conversions, user behavior, and performance metrics

export interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  timestamp: number;
  sessionId: string;
  userId?: string;
  page: string;
  referrer?: string;
  userAgent?: string;
}

export interface ConversionEvent {
  type: 'cta_click' | 'demo_watch' | 'pricing_view' | 'signup_start' | 'purchase_complete';
  element: string;
  page: string;
  timestamp: number;
  sessionId: string;
  userId?: string;
  metadata?: Record<string, any>;
}

export interface PerformanceMetrics {
  pageLoadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  firstInputDelay: number;
  cumulativeLayoutShift: number;
  timestamp: number;
  page: string;
  sessionId: string;
}

class PrepFlowAnalytics {
  private sessionId: string;
  private userId?: string;
  private events: AnalyticsEvent[] = [];
  private conversions: ConversionEvent[] = [];
  private performance: PerformanceMetrics[] = [];

  constructor() {
    this.sessionId = this.generateSessionId();
    this.loadUserId();
    this.initializeAnalytics();
  }

  private generateSessionId(): string {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  private loadUserId(): void {
    if (typeof window !== 'undefined') {
      this.userId = localStorage.getItem('prepflow_user_id') || undefined;
    }
  }

  private initializeAnalytics(): void {
    if (typeof window !== 'undefined') {
      // Track page views
      this.trackPageView();
      
      // Track performance metrics
      this.trackPerformance();
      
      // Track user interactions
      this.trackUserInteractions();
      
      // Track conversions
      this.trackConversions();
    }
  }

  private trackPageView(): void {
    const event: AnalyticsEvent = {
      action: 'page_view',
      category: 'navigation',
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userId: this.userId,
      page: window.location.pathname,
      referrer: document.referrer,
      userAgent: navigator.userAgent
    };
    
    this.events.push(event);
    this.sendToAnalytics(event);
  }

  private trackPerformance(): void {
    if ('performance' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            const metrics: PerformanceMetrics = {
              pageLoadTime: navEntry.loadEventEnd - navEntry.loadEventStart,
              firstContentfulPaint: 0,
              largestContentfulPaint: 0,
              firstInputDelay: 0,
              cumulativeLayoutShift: 0,
              timestamp: Date.now(),
              page: window.location.pathname,
              sessionId: this.sessionId
            };
            
            this.performance.push(metrics);
            this.sendPerformanceMetrics(metrics);
          }
        }
      });
      
      observer.observe({ entryTypes: ['navigation'] });
    }
  }

  private trackUserInteractions(): void {
    // Track CTA clicks
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const cta = target.closest('a, button');
      
      if (cta) {
        const text = cta.textContent?.trim() || '';
        const href = (cta as HTMLAnchorElement).href;
        
        // Track Gumroad purchase links
        if (href && href.includes('gumroad.com/l/prepflow')) {
          this.trackConversion({
            type: 'cta_click',
            element: 'gumroad_purchase',
            page: window.location.pathname,
            timestamp: Date.now(),
            sessionId: this.sessionId,
            userId: this.userId,
            metadata: { href, text, action: 'purchase_start' }
          });
          
          // Send enhanced GA4 event
          if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'begin_checkout', {
              currency: 'AUD',
              value: 29.00,
              items: [{
                item_id: 'prepflow_app',
                item_name: 'PrepFlow App',
                price: 29.00,
                quantity: 1
              }]
            });
          }
        }
        
        // Track demo/watch buttons
        if (text.includes('Watch Demo') || text.includes('Demo')) {
          this.trackConversion({
            type: 'demo_watch',
            element: text,
            page: window.location.pathname,
            timestamp: Date.now(),
            sessionId: this.sessionId,
            userId: this.userId,
            metadata: { href, text, action: 'demo_start' }
          });
        }
        
        // Track general CTA clicks
        if (text.includes('Get Started') || text.includes('Start')) {
          this.trackConversion({
            type: 'cta_click',
            element: text,
            page: window.location.pathname,
            timestamp: Date.now(),
            sessionId: this.sessionId,
            userId: this.userId,
            metadata: { href, text, action: 'cta_click' }
          });
        }
      }
    });

    // Track scroll depth and key sections
    let maxScrollDepth = 0;
    const keySections = ['#features', '#demo', '#pricing', '#faq'];
    
    window.addEventListener('scroll', () => {
      const scrollDepth = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
      if (scrollDepth > maxScrollDepth) {
        maxScrollDepth = scrollDepth;
        if (maxScrollDepth % 25 === 0) { // Track every 25%
          this.trackEvent('scroll_depth', 'engagement', `${maxScrollDepth}%`);
        }
      }
      
      // Track key section visibility
      keySections.forEach(sectionId => {
        const section = document.querySelector(sectionId);
        if (section) {
          const rect = section.getBoundingClientRect();
          const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
          
          if (isVisible && !section.hasAttribute('data-tracked')) {
            section.setAttribute('data-tracked', 'true');
            const sectionName = sectionId.replace('#', '');
            
            this.trackEvent('section_view', 'engagement', sectionName);
            
            // Send enhanced GA4 event for key sections
            if (typeof window !== 'undefined' && window.gtag) {
              if (sectionName === 'pricing') {
                window.gtag('event', 'view_item_list', {
                  item_list_id: 'pricing_section',
                  item_list_name: 'Pricing Options'
                });
              } else if (sectionName === 'demo') {
                window.gtag('event', 'view_item', {
                  item_id: 'demo_video',
                  item_name: 'PrepFlow Demo Video'
                });
              }
            }
          }
        }
      });
    });
  }

  private trackConversions(): void {
    // Track demo video views
    const demoVideo = document.querySelector('iframe[src*="youtube"]');
    if (demoVideo) {
      // YouTube iframe tracking would require YouTube API integration
      // For now, we'll track when the demo section comes into view
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.trackConversion({
              type: 'demo_watch',
              element: 'demo_section',
              page: window.location.pathname,
              timestamp: Date.now(),
              sessionId: this.sessionId,
              userId: this.userId,
              metadata: { section: 'demo' }
            });
            observer.disconnect();
          }
        });
      });
      observer.observe(demoVideo);
    }
  }

  public trackEvent(action: string, category: string, label?: string, value?: number): void {
    const event: AnalyticsEvent = {
      action,
      category,
      label,
      value,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userId: this.userId,
      page: typeof window !== 'undefined' ? window.location.pathname : '/',
      referrer: typeof window !== 'undefined' ? document.referrer : undefined,
      userAgent: typeof window !== 'undefined' ? navigator.userAgent : undefined
    };
    
    this.events.push(event);
    this.sendToAnalytics(event);
  }

  public trackConversion(conversion: ConversionEvent): void {
    this.conversions.push(conversion);
    this.sendConversionData(conversion);
    
    // Also track as a regular event
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
      sessionId: this.sessionId,
      ...metrics
    };
    
    this.performance.push(fullMetrics);
    this.sendPerformanceMetrics(fullMetrics);
  }

  private sendToAnalytics(event: AnalyticsEvent): void {
    // Send to Vercel Analytics (automatic)
    // Send to custom analytics endpoint if needed
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Analytics Event:', event);
    }
    
    // Send to Google Analytics 4
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        custom_parameter_session_id: event.sessionId,
        custom_parameter_user_id: event.userId,
        custom_parameter_page: event.page,
        custom_parameter_referrer: event.referrer,
      });
    }
  }

  private sendConversionData(conversion: ConversionEvent): void {
    if (process.env.NODE_ENV === 'development') {
      console.log('🎯 Conversion Event:', conversion);
    }
    
    // Send to Google Analytics 4
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'conversion', {
        event_category: 'conversion',
        event_label: conversion.type,
        value: 1,
        custom_parameter_element: conversion.element,
        custom_parameter_page: conversion.page,
        custom_parameter_session_id: conversion.sessionId,
        custom_parameter_user_id: conversion.userId,
        custom_parameter_metadata: JSON.stringify(conversion.metadata),
      });
    }
    
    // Send to conversion tracking endpoints
    // Example: Facebook Pixel, Google Ads, etc.
  }

  private sendPerformanceMetrics(metrics: PerformanceMetrics): void {
    if (process.env.NODE_ENV === 'development') {
      console.log('⚡ Performance Metrics:', metrics);
    }
    
    // Send to performance monitoring services
    // Example: Sentry, LogRocket, etc.
  }

  public getSessionId(): string {
    return this.sessionId;
  }

  public getUserId(): string | undefined {
    return this.userId;
  }

  public setUserId(userId: string): void {
    this.userId = userId;
    if (typeof window !== 'undefined') {
      localStorage.setItem('prepflow_user_id', userId);
    }
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
      sessionId: this.sessionId,
      userId: this.userId,
      events: this.events,
      conversions: this.conversions,
      performance: this.performance
    };
  }
}

// Create singleton instance
export const analytics = new PrepFlowAnalytics();

// Export individual functions for easy use
export const trackEvent = analytics.trackEvent.bind(analytics);
export const trackConversion = analytics.trackConversion.bind(analytics);
export const trackPerformance = analytics.trackPerformanceMetrics.bind(analytics);
export const getSessionId = analytics.getSessionId.bind(analytics);
export const setUserId = analytics.setUserId.bind(analytics);
