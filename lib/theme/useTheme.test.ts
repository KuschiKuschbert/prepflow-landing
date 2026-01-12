
// Mock env vars for smoke test
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://mock.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'mock-key';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'mock-service-key';
process.env.NEXT_PUBLIC_AUTH0_DOMAIN = 'mock-domain.auth0.com';
process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID = 'mock-client-id';

import * as Module from './useTheme';

describe('useTheme', () => {
  it('module loads (smoke test)', () => {
    expect(Module).toBeDefined();
  });
});
