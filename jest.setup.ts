import { loadEnvConfig } from '@next/env';
import '@testing-library/jest-dom';

const projectDir = process.cwd();
loadEnvConfig(projectDir);

// Ensure required env vars are present for tests
process.env.NEXT_PUBLIC_SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://test.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'test-anon-key';
process.env.SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'test-service-role-key';
process.env.AUTH0_SECRET =
  process.env.AUTH0_SECRET || 'test-auth0-secret-32-characters-minimum!!';
process.env.AUTH0_BASE_URL = process.env.AUTH0_BASE_URL || 'http://localhost:3000';
process.env.AUTH0_ISSUER_BASE_URL =
  process.env.AUTH0_ISSUER_BASE_URL || 'https://example.auth0.com';
process.env.AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID || 'test-client-id';
process.env.AUTH0_CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET || 'test-client-secret';

// Polyfill Web APIs missing in JSDOM
// Node 18+ has these globally, but JSDOM environment might hide them
const polyfillWebAPIs = () => {
  const MockRequest = class {
    constructor() {}
    static json = jest.fn();
  };
  (MockRequest.prototype as any).json = jest.fn();

  const MockResponse = class {
    constructor() {}
    static json = jest.fn();
  };
  (MockResponse.prototype as any).json = jest.fn();

  const MockHeaders = class {
    constructor() {}
  };

  const MockPerformanceObserver = class {
    constructor(callback: any) {}
    observe() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  };

  const apis = {
    Request: MockRequest,
    Response: MockResponse,
    Headers: MockHeaders,
    fetch: jest.fn(),
    PerformanceObserver: MockPerformanceObserver,
  };

  Object.entries(apis).forEach(([key, value]) => {
    if (typeof (global as any)[key] === 'undefined') {
      (global as any)[key] = value;
    }
    if (typeof (globalThis as any)[key] === 'undefined') {
      (globalThis as any)[key] = value;
    }
    if (typeof window !== 'undefined') {
      if (typeof (window as any)[key] === 'undefined') {
        (window as any)[key] = value;
      }
    }
  });

  // Polyfill URL.createObjectURL if missing
  if (typeof window !== 'undefined') {
    if (!window.URL.createObjectURL) {
      Object.defineProperty(window.URL, 'createObjectURL', { value: jest.fn(() => 'blob:mock') });
      Object.defineProperty(window.URL, 'revokeObjectURL', { value: jest.fn() });
    }
  }
};

polyfillWebAPIs();

// Mock Auth0 which has ESM issues in Jest
const mockAuth0 = {
  useUser: () => ({ user: null, error: null, isLoading: false }),
  withPageAuthRequired: (comp: any) => comp,
  getSession: () => null,
  getAccessToken: () => ({ accessToken: 'test-token' }),
  UserProvider: ({ children }: any) => children,
  Auth0Client: class {
    constructor() {
      return {
        getSession: jest.fn(),
        getAccessToken: jest.fn(),
        updateSession: jest.fn(),
      } as any;
    }
  },
};

jest.mock('@auth0/nextjs-auth0', () => mockAuth0, { virtual: true });
jest.mock('@auth0/nextjs-auth0/client', () => mockAuth0, { virtual: true });
jest.mock('@auth0/nextjs-auth0/server', () => mockAuth0, { virtual: true });

// Mock auth0 (SDK)
jest.mock('auth0', () => ({
  ManagementClient: jest.fn().mockImplementation(() => ({
    getUsers: jest.fn().mockResolvedValue([]),
    updateUser: jest.fn().mockResolvedValue({}),
  })),
  Auth0Client: jest.fn().mockImplementation(() => ({
    // Add common methods if needed
  })),
}), { virtual: true });

// Mock next-auth if used in tests
jest.mock('next-auth', () => ({
  useSession: () => ({ data: null, status: 'unauthenticated' }),
  signIn: jest.fn(),
  signOut: jest.fn(),
  getServerSession: jest.fn(),
}), { virtual: true });

// Mock @/lib/auth-options which might be missing but used in some tests
jest.mock('./lib/auth-options.mock.ts', () => ({
  authOptions: {},
}), { virtual: true });
