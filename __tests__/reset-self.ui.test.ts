/**
 * Basic import and shape test for ResetSelfDataCard component
 */

describe('ResetSelfDataCard component', () => {
  test('should be importable', async () => {
    const mod = await import('../app/webapp/setup/components/ResetSelfDataCard');
    expect(typeof mod.default).toBe('function');
  });
});
