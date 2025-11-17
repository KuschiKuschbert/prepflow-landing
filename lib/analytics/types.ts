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
  type:
    | 'cta_click'
    | 'demo_watch'
    | 'pricing_view'
    | 'signup_start'
    | 'purchase_complete'
    | 'exit_intent'
    | 'section_view'
    | 'scroll_milestone';
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
