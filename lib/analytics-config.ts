// PrepFlow Analytics Configuration
// Configure analytics services, tracking events, and conversion goals

export interface AnalyticsConfig {
  // Vercel Analytics (already implemented)
  vercel: {
    enabled: boolean;
  };
  
  // Google Analytics 4
  googleAnalytics: {
    enabled: boolean;
    measurementId?: string;
    debugMode: boolean;
  };
  
  // Facebook Pixel
  facebookPixel: {
    enabled: boolean;
    pixelId?: string;
  };
  
  // Google Ads Conversion Tracking
  googleAds: {
    enabled: boolean;
    conversionId?: string;
    conversionLabel?: string;
  };
  
  // Custom Conversion Tracking
  customTracking: {
    enabled: boolean;
    endpoint?: string;
    apiKey?: string;
  };
  
  // Performance Monitoring
  performance: {
    enabled: boolean;
    trackCoreWebVitals: boolean;
    trackCustomMetrics: boolean;
  };
  
  // User Behavior Tracking
  userBehavior: {
    enabled: boolean;
    trackScrollDepth: boolean;
    trackTimeOnPage: boolean;
    trackClicks: boolean;
    trackFormInteractions: boolean;
  };
  
  // Privacy & Compliance
  privacy: {
    respectDoNotTrack: boolean;
    anonymizeIP: boolean;
    cookieConsent: boolean;
    gdprCompliant: boolean;
  };
}

// Default configuration
export const defaultAnalyticsConfig: AnalyticsConfig = {
  vercel: {
    enabled: true,
  },
  
  googleAnalytics: {
    enabled: true,
    measurementId: 'G-W1D5LQXGJT',
    debugMode: process.env.NODE_ENV === 'development',
  },
  
  facebookPixel: {
    enabled: false,
    pixelId: process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID,
  },
  
  googleAds: {
    enabled: false,
    conversionId: process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID,
    conversionLabel: process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL,
  },
  
  customTracking: {
    enabled: false,
    endpoint: process.env.NEXT_PUBLIC_CUSTOM_TRACKING_ENDPOINT,
    apiKey: process.env.NEXT_PUBLIC_CUSTOM_TRACKING_API_KEY,
  },
  
  performance: {
    enabled: true,
    trackCoreWebVitals: true,
    trackCustomMetrics: true,
  },
  
  userBehavior: {
    enabled: true,
    trackScrollDepth: true,
    trackTimeOnPage: true,
    trackClicks: true,
    trackFormInteractions: true,
  },
  
  privacy: {
    respectDoNotTrack: true,
    anonymizeIP: true,
    cookieConsent: false, // Set to true if you implement cookie consent
    gdprCompliant: true,
  },
};

// Conversion goals configuration
export interface ConversionGoal {
  id: string;
  name: string;
  type: 'page_view' | 'click' | 'scroll' | 'time_on_page' | 'form_submit';
  target: string; // CSS selector, URL, or other identifier
  value: number; // Conversion value in cents
  category: 'micro' | 'macro';
  description: string;
}

export const conversionGoals: ConversionGoal[] = [
  {
    id: 'hero_cta_click',
    name: 'Hero CTA Click',
    type: 'click',
    target: 'a[href*="gumroad.com/l/prepflow"]',
    value: 100, // $1.00
    category: 'micro',
    description: 'User clicked the main CTA button in the hero section'
  },
  {
    id: 'demo_section_view',
    name: 'Demo Section View',
    type: 'scroll',
    target: '#demo',
    value: 250, // $2.50
    category: 'micro',
    description: 'User scrolled to and viewed the demo section'
  },
  {
    id: 'pricing_section_view',
    name: 'Pricing Section View',
    type: 'scroll',
    target: '#pricing',
    value: 500, // $5.00
    category: 'micro',
    description: 'User scrolled to and viewed the pricing section'
  },
  {
    id: 'purchase_complete',
    name: 'Purchase Complete',
    type: 'page_view',
    target: '/thank-you',
    value: 2900, // $29.00 (one-time purchase)
    category: 'macro',
    description: 'User completed a purchase and reached thank you page'
  },

];

// Event categories for consistent tracking
export const eventCategories = {
  navigation: 'navigation',
  engagement: 'engagement',
  conversion: 'conversion',
  performance: 'performance',
  error: 'error',
  business: 'business'
} as const;

// Event actions for consistent tracking
export const eventActions = {
  // Navigation
  page_view: 'page_view',
  link_click: 'link_click',
  navigation: 'navigation',
  
  // Engagement
  scroll_depth: 'scroll_depth',
  time_on_page: 'time_on_page',
  video_play: 'video_play',
  video_pause: 'video_pause',
  video_complete: 'video_complete',
  
  // Conversion
  cta_click: 'cta_click',
  form_start: 'form_start',
  form_submit: 'form_submit',
  purchase_start: 'purchase_start',
  purchase_complete: 'purchase_complete',
  
  // Performance
  page_load: 'page_load',
  first_contentful_paint: 'first_contentful_paint',
  largest_contentful_paint: 'largest_contentful_paint',
  first_input_delay: 'first_input_delay',
  cumulative_layout_shift: 'cumulative_layout_shift',
  
  // Business
  feature_usage: 'feature_usage',
  user_registration: 'user_registration',

} as const;

// Helper function to check if analytics should be enabled
export function shouldEnableAnalytics(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Check Do Not Track
  if (navigator.doNotTrack === '1') return false;
  
  // Check for privacy mode (using type assertion for non-standard property)
  if ((navigator as any).privateBrowsing) return false;
  
  return true;
}

// Helper function to get environment-specific config
export function getAnalyticsConfig(): AnalyticsConfig {
  const config = { ...defaultAnalyticsConfig };
  
  // Override with environment variables
  if (process.env.NODE_ENV === 'development') {
    config.googleAnalytics.debugMode = true;
  }
  
  // Check if analytics should be enabled
  if (!shouldEnableAnalytics()) {
    config.vercel.enabled = false;
    config.googleAnalytics.enabled = false;
    config.facebookPixel.enabled = false;
    config.googleAds.enabled = false;
  }
  
  return config;
}
