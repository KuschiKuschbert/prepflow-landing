import '@testing-library/jest-dom';

// Mock environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';
process.env.AUTH0_SECRET = 'a_very_long_random_string_for_testing_purposes_at_least_32_chars';
process.env.AUTH0_BASE_URL = 'http://localhost:3000';
process.env.AUTH0_ISSUER_BASE_URL = 'https://test.auth0.com';
process.env.AUTH0_CLIENT_ID = 'test-client-id';
process.env.AUTH0_CLIENT_SECRET = 'test-client-secret';

// Mock PerformanceObserver
// Mock PerformanceObserver
const MockPerformanceObserver = class PerformanceObserver {
  observe() {}
  disconnect() {}
  takeRecords() { return []; }
} as any;

global.PerformanceObserver = MockPerformanceObserver;
if (typeof window !== 'undefined') {
  window.PerformanceObserver = MockPerformanceObserver;
}
globalThis.PerformanceObserver = MockPerformanceObserver;

// Polyfill Request/Response for Next.js App Router

// Polyfill Request/Response for Next.js App Router
if (typeof global.Request === 'undefined') {
  global.Request = class Request {
    constructor(input: any, init: any) {
      (this as any).url = input;
      (this as any).method = init?.method || 'GET';
      (this as any).headers = new Headers(init?.headers);
    }
  } as any;
}

if (typeof global.Response === 'undefined') {
  global.Response = class Response {
    json() { return Promise.resolve({}); }
  } as any;
}

if (typeof global.Headers === 'undefined') {
  global.Headers = class Headers extends Map {} as any;
}
