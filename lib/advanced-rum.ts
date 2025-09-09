// Advanced Real User Monitoring (RUM) for PrepFlow
// Implements comprehensive performance monitoring with error tracking

// RUM configuration
export const RUM_CONFIG = {
  // Sampling rates
  sampling: {
    performance: 0.1,      // 10% of users for performance monitoring
    errors: 1.0,           // 100% of users for error tracking
    userInteractions: 0.05, // 5% of users for interaction tracking
    resourceTiming: 0.2,   // 20% of users for resource timing
  },
  
  // Performance thresholds
  thresholds: {
    lcp: 2500,             // Largest Contentful Paint (ms)
    fid: 100,              // First Input Delay (ms)
    cls: 0.1,              // Cumulative Layout Shift
    fcp: 1800,             // First Contentful Paint (ms)
    tti: 3800,             // Time to Interactive (ms)
    si: 3000,              // Speed Index (ms)
    tbt: 300,              // Total Blocking Time (ms)
  },
  
  // Error tracking
  errorTracking: {
    enabled: true,
    maxErrors: 100,        // Maximum errors to track per session
    errorTimeout: 5000,    // Error timeout in ms
  },
  
  // Session tracking
  session: {
    timeout: 30 * 60 * 1000, // 30 minutes
    maxDuration: 24 * 60 * 60 * 1000, // 24 hours
  },
};

// RUM data interfaces
export interface RUMData {
  sessionId: string;
  userId?: string;
  page: string;
  timestamp: number;
  userAgent: string;
  viewport: { width: number; height: number };
  connection: {
    effectiveType: string;
    downlink: number;
    rtt: number;
  };
  performance: PerformanceMetrics;
  errors: ErrorData[];
  interactions: InteractionData[];
  resources: ResourceData[];
  navigation: NavigationData;
}

export interface PerformanceMetrics {
  lcp?: number;
  fid?: number;
  cls?: number;
  fcp?: number;
  tti?: number;
  si?: number;
  tbt?: number;
  memory?: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  };
}

export interface ErrorData {
  message: string;
  stack?: string;
  filename?: string;
  lineno?: number;
  colno?: number;
  timestamp: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  context?: Record<string, any>;
}

export interface InteractionData {
  type: 'click' | 'scroll' | 'keydown' | 'resize' | 'focus' | 'blur';
  target: string;
  timestamp: number;
  x?: number;
  y?: number;
  key?: string;
  deltaX?: number;
  deltaY?: number;
}

export interface ResourceData {
  name: string;
  type: string;
  duration: number;
  size: number;
  startTime: number;
  endTime: number;
  success: boolean;
  error?: string;
}

export interface NavigationData {
  type: 'navigate' | 'reload' | 'back_forward' | 'prerender';
  startTime: number;
  endTime: number;
  duration: number;
  redirectCount: number;
  transferSize: number;
  encodedBodySize: number;
  decodedBodySize: number;
}

// Advanced RUM manager
export class AdvancedRUMManager {
  private static instance: AdvancedRUMManager;
  private sessionId: string;
  private userId?: string;
  private startTime: number;
  private data: RUMData;
  private observers: Map<string, PerformanceObserver> = new Map();
  private errorCount = 0;
  private isInitialized = false;
  
  static getInstance(): AdvancedRUMManager {
    if (!AdvancedRUMManager.instance) {
      AdvancedRUMManager.instance = new AdvancedRUMManager();
    }
    return AdvancedRUMManager.instance;
  }
  
  constructor() {
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();
    this.data = this.initializeRUMData();
  }
  
  // Initialize RUM monitoring
  initialize(): void {
    if (this.isInitialized || typeof window === 'undefined') return;
    
    console.log('🔍 Initializing Advanced RUM monitoring...');
    
    // Initialize performance monitoring
    this.initializePerformanceMonitoring();
    
    // Initialize error tracking
    this.initializeErrorTracking();
    
    // Initialize interaction tracking
    this.initializeInteractionTracking();
    
    // Initialize resource monitoring
    this.initializeResourceMonitoring();
    
    // Initialize navigation monitoring
    this.initializeNavigationMonitoring();
    
    // Initialize session management
    this.initializeSessionManagement();
    
    this.isInitialized = true;
    console.log('✅ Advanced RUM monitoring initialized');
  }
  
  // Initialize performance monitoring
  private initializePerformanceMonitoring(): void {
    if (Math.random() > RUM_CONFIG.sampling.performance) return;
    
    // LCP Observer
    if ('PerformanceObserver' in window) {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as PerformanceEntry;
        if (lastEntry) {
          this.data.performance.lcp = lastEntry.startTime;
          this.trackPerformanceMetric('lcp', lastEntry.startTime);
        }
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.set('lcp', lcpObserver);
    }
    
    // FID Observer
    if ('PerformanceObserver' in window) {
      const fidObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry: any) => {
          const fid = entry.processingStart - entry.startTime;
          this.data.performance.fid = fid;
          this.trackPerformanceMetric('fid', fid);
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
      this.observers.set('fid', fidObserver);
    }
    
    // CLS Observer
    if ('PerformanceObserver' in window) {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      this.observers.set('cls', clsObserver);
      
      // Track CLS after a delay
      setTimeout(() => {
        this.data.performance.cls = clsValue;
        this.trackPerformanceMetric('cls', clsValue);
      }, 5000);
    }
    
    // Memory monitoring
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      this.data.performance.memory = {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit,
      };
    }
  }
  
  // Initialize error tracking
  private initializeErrorTracking(): void {
    if (!RUM_CONFIG.errorTracking.enabled) return;
    
    // Global error handler
    window.addEventListener('error', (event) => {
      this.trackError({
        message: event.message,
        stack: event.error?.stack,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        timestamp: Date.now(),
        severity: this.getErrorSeverity(event.error),
        context: {
          url: window.location.href,
          userAgent: navigator.userAgent,
          viewport: {
            width: window.innerWidth,
            height: window.innerHeight,
          },
        },
      });
    });
    
    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      this.trackError({
        message: `Unhandled Promise Rejection: ${event.reason}`,
        stack: event.reason?.stack,
        timestamp: Date.now(),
        severity: 'high',
        context: {
          url: window.location.href,
          userAgent: navigator.userAgent,
        },
      });
    });
  }
  
  // Initialize interaction tracking
  private initializeInteractionTracking(): void {
    if (Math.random() > RUM_CONFIG.sampling.userInteractions) return;
    
    const interactionTypes = ['click', 'scroll', 'keydown', 'resize', 'focus', 'blur'];
    
    interactionTypes.forEach(type => {
      window.addEventListener(type, (event) => {
        this.trackInteraction({
          type: type as any,
          target: this.getElementSelector(event.target as Element),
          timestamp: Date.now(),
          x: (event as MouseEvent).clientX,
          y: (event as MouseEvent).clientY,
          key: (event as KeyboardEvent).key,
          deltaX: (event as WheelEvent).deltaX,
          deltaY: (event as WheelEvent).deltaY,
        });
      });
    });
  }
  
  // Initialize resource monitoring
  private initializeResourceMonitoring(): void {
    if (Math.random() > RUM_CONFIG.sampling.resourceTiming) return;
    
    if ('PerformanceObserver' in window) {
      const resourceObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry: any) => {
          if (entry.entryType === 'resource') {
            this.trackResource({
              name: entry.name,
              type: entry.initiatorType,
              duration: entry.duration,
              size: entry.transferSize || 0,
              startTime: entry.startTime,
              endTime: entry.startTime + entry.duration,
              success: entry.transferSize > 0,
              error: entry.transferSize === 0 ? 'Failed to load' : undefined,
            });
          }
        });
      });
      resourceObserver.observe({ entryTypes: ['resource'] });
      this.observers.set('resource', resourceObserver);
    }
  }
  
  // Initialize navigation monitoring
  private initializeNavigationMonitoring(): void {
    if ('PerformanceObserver' in window) {
      const navObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry: any) => {
          if (entry.entryType === 'navigation') {
            this.data.navigation = {
              type: entry.type,
              startTime: entry.startTime,
              endTime: entry.loadEventEnd,
              duration: entry.loadEventEnd - entry.startTime,
              redirectCount: entry.redirectCount,
              transferSize: entry.transferSize,
              encodedBodySize: entry.encodedBodySize,
              decodedBodySize: entry.decodedBodySize,
            };
          }
        });
      });
      navObserver.observe({ entryTypes: ['navigation'] });
      this.observers.set('navigation', navObserver);
    }
  }
  
  // Initialize session management
  private initializeSessionManagement(): void {
    // Session timeout
    setTimeout(() => {
      this.endSession();
    }, RUM_CONFIG.session.timeout);
    
    // Page visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseSession();
      } else {
        this.resumeSession();
      }
    });
    
    // Page unload
    window.addEventListener('beforeunload', () => {
      this.endSession();
    });
  }
  
  // Track performance metric
  private trackPerformanceMetric(metric: string, value: number): void {
    const threshold = RUM_CONFIG.thresholds[metric as keyof typeof RUM_CONFIG.thresholds];
    const isViolation = threshold && value > threshold;
    
    if (isViolation) {
      console.warn(`⚠️ Performance threshold exceeded: ${metric} = ${value}ms (threshold: ${threshold}ms)`);
    }
    
    // Send to analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'performance_metric', {
        event_category: 'performance',
        event_label: metric,
        value: Math.round(value),
        custom_parameter_metric: metric,
        custom_parameter_value: Math.round(value),
        custom_parameter_threshold: threshold,
        custom_parameter_violation: isViolation,
      });
    }
  }
  
  // Track error
  private trackError(error: ErrorData): void {
    if (this.errorCount >= RUM_CONFIG.errorTracking.maxErrors) return;
    
    this.data.errors.push(error);
    this.errorCount++;
    
    console.error('🚨 RUM Error tracked:', error);
    
    // Send to analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'rum_error', {
        event_category: 'error',
        event_label: error.severity,
        value: 1,
        custom_parameter_error_message: error.message,
        custom_parameter_error_severity: error.severity,
        custom_parameter_error_filename: error.filename,
        custom_parameter_error_line: error.lineno,
      });
    }
  }
  
  // Track interaction
  private trackInteraction(interaction: InteractionData): void {
    this.data.interactions.push(interaction);
    
    // Send to analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'user_interaction', {
        event_category: 'interaction',
        event_label: interaction.type,
        value: 1,
        custom_parameter_interaction_type: interaction.type,
        custom_parameter_interaction_target: interaction.target,
      });
    }
  }
  
  // Track resource
  private trackResource(resource: ResourceData): void {
    this.data.resources.push(resource);
    
    // Send to analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'resource_load', {
        event_category: 'performance',
        event_label: resource.type,
        value: Math.round(resource.duration),
        custom_parameter_resource_name: resource.name,
        custom_parameter_resource_type: resource.type,
        custom_parameter_resource_duration: Math.round(resource.duration),
        custom_parameter_resource_size: resource.size,
        custom_parameter_resource_success: resource.success,
      });
    }
  }
  
  // Get error severity
  private getErrorSeverity(error: Error): 'low' | 'medium' | 'high' | 'critical' {
    if (error.name === 'ChunkLoadError' || error.name === 'Loading chunk failed') {
      return 'critical';
    }
    if (error.name === 'TypeError' || error.name === 'ReferenceError') {
      return 'high';
    }
    if (error.name === 'SyntaxError') {
      return 'medium';
    }
    return 'low';
  }
  
  // Get element selector
  private getElementSelector(element: Element): string {
    if (element.id) return `#${element.id}`;
    if (element.className) return `.${element.className.split(' ')[0]}`;
    return element.tagName.toLowerCase();
  }
  
  // Generate session ID
  private generateSessionId(): string {
    return 'rum_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }
  
  // Initialize RUM data
  private initializeRUMData(): RUMData {
    if (typeof window === 'undefined') {
      // Server-side fallback
      return {
        sessionId: this.sessionId,
        userId: this.userId,
        page: '/',
        timestamp: Date.now(),
        userAgent: 'Server',
        viewport: { width: 0, height: 0 },
        connection: {
          effectiveType: 'unknown',
          downlink: 0,
          rtt: 0,
        },
        performance: {},
        errors: [],
        interactions: [],
        resources: [],
        navigation: {
          type: 'navigate',
          startTime: 0,
          endTime: 0,
          duration: 0,
          redirectCount: 0,
          transferSize: 0,
          encodedBodySize: 0,
          decodedBodySize: 0,
        },
      };
    }
    
    return {
      sessionId: this.sessionId,
      userId: this.userId,
      page: window.location.pathname,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      connection: {
        effectiveType: (navigator as any).connection?.effectiveType || 'unknown',
        downlink: (navigator as any).connection?.downlink || 0,
        rtt: (navigator as any).connection?.rtt || 0,
      },
      performance: {},
      errors: [],
      interactions: [],
      resources: [],
      navigation: {
        type: 'navigate',
        startTime: 0,
        endTime: 0,
        duration: 0,
        redirectCount: 0,
        transferSize: 0,
        encodedBodySize: 0,
        decodedBodySize: 0,
      },
    };
  }
  
  // Pause session
  private pauseSession(): void {
    console.log('⏸️ RUM session paused');
  }
  
  // Resume session
  private resumeSession(): void {
    console.log('▶️ RUM session resumed');
  }
  
  // End session
  private endSession(): void {
    console.log('🏁 RUM session ended');
    
    // Send final data
    this.sendRUMData();
    
    // Clean up observers
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
  }
  
  // Send RUM data
  private sendRUMData(): void {
    // Send to analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'rum_session_end', {
        event_category: 'performance',
        event_label: 'session_end',
        value: this.data.performance.lcp || 0,
        custom_parameter_session_id: this.data.sessionId,
        custom_parameter_page: this.data.page,
        custom_parameter_errors: this.data.errors.length,
        custom_parameter_interactions: this.data.interactions.length,
        custom_parameter_resources: this.data.resources.length,
        custom_parameter_lcp: this.data.performance.lcp,
        custom_parameter_fid: this.data.performance.fid,
        custom_parameter_cls: this.data.performance.cls,
      });
    }
  }
  
  // Get RUM data
  getRUMData(): RUMData {
    return { ...this.data };
  }
  
  // Set user ID
  setUserId(userId: string): void {
    this.userId = userId;
    this.data.userId = userId;
  }
  
  // Get session ID
  getSessionId(): string {
    return this.sessionId;
  }
}

// Export singleton instance
export const advancedRUMManager = AdvancedRUMManager.getInstance();

// Initialize RUM monitoring
export function initializeRUM(): void {
  advancedRUMManager.initialize();
}

// Track custom error
export function trackCustomError(message: string, context?: Record<string, any>): void {
  advancedRUMManager['trackError']({
    message,
    timestamp: Date.now(),
    severity: 'medium',
    context,
  });
}

// Track custom interaction
export function trackCustomInteraction(type: string, target: string, data?: Record<string, any>): void {
  advancedRUMManager['trackInteraction']({
    type: type as any,
    target,
    timestamp: Date.now(),
    ...data,
  });
}
