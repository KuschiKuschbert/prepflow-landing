/**
 * Basic presence tests for the reset-self API route
 */

describe('reset-self API route', () => {
  test('should export POST handler', async () => {
    const mod = await import('../app/api/db/reset-self/route');
    expect(typeof mod.POST).toBe('function');
  });
});
