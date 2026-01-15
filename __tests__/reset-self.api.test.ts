jest.mock('next/server', () => {
  return {
    NextRequest: class {},
    NextResponse: {
      json: (body: any) => ({ json: async () => body }),
    },
  };
});

jest.mock('next-auth', () => {
  return {
    getServerSession: jest.fn(),
  };
});

jest.mock('@/lib/auth-options', () => ({
  authOptions: {},
}), { virtual: true });

jest.mock('@/lib/supabase', () => ({
  createSupabaseAdmin: jest.fn(),
}));

jest.mock('@/lib/populate-helpers', () => ({
  cleanExistingData: jest.fn(),
}));

/**
 * Basic presence tests for the reset-self API route
 */
describe('reset-self API route', () => {
  test('should export POST handler', async () => {
    const mod = await import('../app/api/db/reset-self/route');
    expect(typeof mod.POST).toBe('function');
  });
});
