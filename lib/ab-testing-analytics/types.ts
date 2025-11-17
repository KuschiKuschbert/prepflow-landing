export interface ABTestVariant {
  id: string;
  name: string;
  description: string;
  trafficSplit: number;
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
