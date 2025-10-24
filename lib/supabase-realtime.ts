// Simplified realtime implementation to avoid module resolution issues
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Mock implementation for now to avoid import issues
export const supabaseRealtime = {
  channel: () => ({
    on: () => ({
      subscribe: () => ({}),
    }),
  }),
  removeChannel: () => {},
};

export interface RealtimeSubscription {
  unsubscribe: () => void;
}

export function subscribeToSalesData(callback: (payload: any) => void): RealtimeSubscription {
  // Mock implementation
  console.log('Mock: Subscribing to sales data changes');
  return {
    unsubscribe: () => {
      console.log('Mock: Unsubscribing from sales data changes');
    },
  };
}

export function subscribeToPerformanceMetrics(
  callback: (payload: any) => void,
): RealtimeSubscription {
  // Mock implementation
  console.log('Mock: Subscribing to performance metrics');
  return {
    unsubscribe: () => {
      console.log('Mock: Unsubscribing from performance metrics');
    },
  };
}
