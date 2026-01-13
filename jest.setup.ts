import '@testing-library/jest-dom';

// Mock environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';

// Mock PerformanceObserver
global.PerformanceObserver = class PerformanceObserver {
  observe() {}
  disconnect() {}
  takeRecords() { return []; }
} as any;
