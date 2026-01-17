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
process.env.AUTH0_SECRET = process.env.AUTH0_SECRET || 'test-auth0-secret-32-characters-minimum!!';
process.env.AUTH0_BASE_URL = process.env.AUTH0_BASE_URL || 'http://localhost:3000';
process.env.AUTH0_ISSUER_BASE_URL =
  process.env.AUTH0_ISSUER_BASE_URL || 'https://example.auth0.com';
process.env.AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID || 'test-client-id';
process.env.AUTH0_CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET || 'test-client-secret';

// Polyfill Web APIs missing in JSDOM
const polyfillWebAPIs = () => {
  class MockRequest {
    constructor() {}
    static json = jest.fn();
    json = jest.fn();
  }

  class MockResponse {
    constructor() {}
    static json = jest.fn();
    json = jest.fn();
  }

  class MockHeaders {
    constructor() {}
  }

  class MockPerformanceObserver {
    constructor(callback: unknown) {}
    observe() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  }

  const apis = {
    Request: MockRequest,
    Response: MockResponse,
    Headers: MockHeaders,
    fetch: jest.fn(),
    PerformanceObserver: MockPerformanceObserver,
  };

  type GlobalWithAPIs = typeof globalThis & {
    Request: typeof MockRequest;
    Response: typeof MockResponse;
    Headers: typeof MockHeaders;
    fetch: jest.Mock;
    PerformanceObserver: typeof MockPerformanceObserver;
  };

  const globalTarget = global as unknown as GlobalWithAPIs;
  const globalThisTarget = globalThis as unknown as GlobalWithAPIs;

  Object.entries(apis).forEach(([key, value]) => {
    if (typeof (globalTarget as Record<string, unknown>)[key] === 'undefined') {
      (globalTarget as Record<string, unknown>)[key] = value;
    }
    if (typeof (globalThisTarget as Record<string, unknown>)[key] === 'undefined') {
      (globalThisTarget as Record<string, unknown>)[key] = value;
    }
    if (typeof window !== 'undefined') {
      const windowTarget = window as unknown as Record<string, unknown>;
      if (typeof windowTarget[key] === 'undefined') {
        windowTarget[key] = value;
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

interface MockAuth0 {
  useUser: () => { user: null; error: null; isLoading: boolean };
  withPageAuthRequired: <T>(comp: T) => T;
  getSession: () => null;
  getAccessToken: () => { accessToken: string };
  UserProvider: ({ children }: { children: React.ReactNode }) => React.ReactNode;
  Auth0Client: new () => {
    getSession: jest.Mock;
    getAccessToken: jest.Mock;
    updateSession: jest.Mock;
  };
}

// Mock Auth0 which has ESM issues in Jest
const mockAuth0: MockAuth0 = {
  useUser: () => ({ user: null, error: null, isLoading: false }),
  withPageAuthRequired: comp => comp,
  getSession: () => null,
  getAccessToken: () => ({ accessToken: 'test-token' }),
  UserProvider: ({ children }) => children,
  Auth0Client: class {
    getSession = jest.fn();
    getAccessToken = jest.fn();
    updateSession = jest.fn();
  },
};

jest.mock('@auth0/nextjs-auth0', () => mockAuth0, { virtual: true });
jest.mock('@auth0/nextjs-auth0/client', () => mockAuth0, { virtual: true });
jest.mock('@auth0/nextjs-auth0/server', () => mockAuth0, { virtual: true });

// Mock auth0 (SDK)
jest.mock(
  'auth0',
  () => ({
    ManagementClient: jest.fn().mockImplementation(() => ({
      getUsers: jest.fn().mockResolvedValue([]),
      updateUser: jest.fn().mockResolvedValue({}),
    })),
    Auth0Client: jest.fn().mockImplementation(() => ({
      // Add common methods if needed
    })),
  }),
  { virtual: true },
);

// Mock next-auth if used in tests
jest.mock(
  'next-auth',
  () => ({
    useSession: () => ({ data: null, status: 'unauthenticated' }),
    signIn: jest.fn(),
    signOut: jest.fn(),
    getServerSession: jest.fn(),
  }),
  { virtual: true },
);

// Mock @/lib/auth-options which might be missing but used in some tests
jest.mock(
  './lib/auth-options.mock.ts',
  () => ({
    authOptions: {},
  }),
  { virtual: true },
);
