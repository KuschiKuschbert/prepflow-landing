
// Mock env vars for smoke test
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://mock.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'mock-key';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'mock-service-key';
process.env.NEXT_PUBLIC_AUTH0_DOMAIN = 'mock-domain.auth0.com';
process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID = 'mock-client-id';

import * as Module from './recipes';

describe('recipes', () => {
  it('module exports are defined (smoke test)', () => {
    expect(Module).toBeDefined();

    // Check all exported functions
    Object.entries(Module).forEach(([name, exp]) => {
        if (typeof exp === 'function') {
            expect(exp).toBeDefined();
        }
    });
  });
});
