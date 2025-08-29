// Google Tag Manager Configuration
// Defines data layer structure and tracking events

export interface GTMConfig {
  gtmId: string;
  ga4MeasurementId: string;
  enabled: boolean;
  debugMode: boolean;
}

export const gtmConfig: GTMConfig = {
  gtmId: 'GTM-XXXXXXX', // Replace with your actual GTM container ID
  ga4MeasurementId: 'G-W1D5LQXGJT',
  enabled: true,
  debugMode: process.env.NODE_ENV === 'development',
};

// Data Layer Event Types
export const GTM_EVENTS = {
  // Page tracking
  PAGE_VIEW: 'page_view',
  PAGE_LOAD: 'page_load',
  
  // User engagement
  ENGAGEMENT: 'engagement',
  SCROLL_DEPTH: 'scroll_depth',
  TIME_ON_PAGE: 'time_on_page',
  SECTION_VIEW: 'section_view',
  
  // User interactions
  CLICK: 'click',
  FORM_SUBMIT: 'form_submit',
  VIDEO_PLAY: 'video_play',
  VIDEO_PAUSE: 'video_pause',
  VIDEO_COMPLETE: 'video_complete',
  
  // Conversions
  CONVERSION: 'conversion',
  CTA_CLICK: 'cta_click',
  DEMO_WATCH: 'demo_watch',
  PRICING_VIEW: 'pricing_view',
  PURCHASE_START: 'purchase_start',
  PURCHASE_COMPLETE: 'purchase_complete',
  
  // A/B Testing
  VARIANT_ASSIGNED: 'variant_assigned',
  VARIANT_VIEW: 'variant_view',
  VARIANT_CONVERSION: 'variant_conversion',
  
  // Performance
  PERFORMANCE_METRIC: 'performance_metric',
  CORE_WEB_VITAL: 'core_web_vital',
  SLOW_RESOURCE: 'slow_resource',
  
  // Exit intent
  EXIT_INTENT: 'exit_intent',
  PAGE_UNLOAD: 'page_unload',
  TAB_BACKGROUND: 'tab_background',
} as const;

// Data Layer Variable Names
export const GTM_VARIABLES = {
  // Page information
  PAGE_TITLE: 'page_title',
  PAGE_LOCATION: 'page_location',
  PAGE_PATH: 'page_path',
  PAGE_REFERRER: 'page_referrer',
  
  // User information
  USER_ID: 'user_id',
  SESSION_ID: 'session_id',
  USER_AGENT: 'user_agent',
  
  // Event information
  EVENT_CATEGORY: 'event_category',
  EVENT_ACTION: 'event_action',
  EVENT_LABEL: 'event_label',
  EVENT_VALUE: 'event_value',
  
  // Custom parameters
  CUSTOM_PARAMETER: 'custom_parameter',
  TIMESTAMP: 'timestamp',
  
  // A/B Testing
  TEST_ID: 'test_id',
  VARIANT_ID: 'variant_id',
  VARIANT_NAME: 'variant_name',
  
  // Performance
  PERFORMANCE_TYPE: 'performance_type',
  PERFORMANCE_VALUE: 'performance_value',
  PERFORMANCE_UNIT: 'performance_unit',
} as const;

// Predefined data layer objects for common events
export const GTM_TEMPLATES = {
  // Page view template
  pageView: (pageData: {
    title?: string;
    path?: string;
    referrer?: string;
  } = {}) => ({
    event: GTM_EVENTS.PAGE_VIEW,
    page_title: pageData.title || document.title,
    page_location: window.location.href,
    page_path: pageData.path || window.location.pathname,
    page_referrer: pageData.referrer || document.referrer,
    timestamp: Date.now(),
  }),

  // User engagement template
  engagement: (engagementData: {
    type: string;
    value?: number;
    metadata?: Record<string, any>;
  }) => ({
    event: GTM_EVENTS.ENGAGEMENT,
    engagement_type: engagementData.type,
    engagement_value: engagementData.value,
    ...engagementData.metadata,
    timestamp: Date.now(),
  }),

  // Conversion template
  conversion: (conversionData: {
    type: string;
    value?: number;
    currency?: string;
    metadata?: Record<string, any>;
  }) => ({
    event: GTM_EVENTS.CONVERSION,
    conversion_type: conversionData.type,
    conversion_value: conversionData.value,
    conversion_currency: conversionData.currency || 'AUD',
    ...conversionData.metadata,
    timestamp: Date.now(),
  }),

  // A/B test template
  abTest: (abTestData: {
    testId: string;
    variantId: string;
    variantName?: string;
    action: string;
    metadata?: Record<string, any>;
  }) => ({
    event: GTM_EVENTS.VARIANT_ASSIGNED,
    test_id: abTestData.testId,
    variant_id: abTestData.variantId,
    variant_name: abTestData.variantName,
    ab_test_action: abTestData.action,
    ...abTestData.metadata,
    timestamp: Date.now(),
  }),

  // Performance template
  performance: (performanceData: {
    type: string;
    value: number;
    unit?: string;
    metadata?: Record<string, any>;
  }) => ({
    event: GTM_EVENTS.PERFORMANCE_METRIC,
    performance_type: performanceData.type,
    performance_value: performanceData.value,
    performance_unit: performanceData.unit || 'ms',
    ...performanceData.metadata,
    timestamp: Date.now(),
  }),
};

// Helper function to validate GTM configuration
export function validateGTMConfig(): boolean {
  if (!gtmConfig.gtmId || gtmConfig.gtmId === 'GTM-XXXXXXX') {
    console.error('❌ GTM Container ID not configured. Please update gtm-config.ts');
    return false;
  }
  
  if (!gtmConfig.ga4MeasurementId) {
    console.error('❌ GA4 Measurement ID not configured');
    return false;
  }
  
  return true;
}

// Helper function to get GTM configuration
export function getGTMConfig(): GTMConfig {
  return { ...gtmConfig };
}
