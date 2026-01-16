export interface ABTestVariant {
  id: string;
  name: string;
  description: string;
  trafficSplit: number;
  isControl: boolean;
}

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

export interface ABTestEvent {
  testId: string;
  variantId: string;
  userId: string;
  sessionId: string;
  eventType: 'variant_assigned' | 'page_view' | 'conversion' | 'engagement';
  eventValue?: number;
  timestamp: number;
  metadata?: Record<string, JsonValue>;
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
