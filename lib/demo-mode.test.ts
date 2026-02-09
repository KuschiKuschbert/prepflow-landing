import { isDemoUser } from './demo-mode';

describe('Demo Mode Logic', () => {
  it('identifies the demo user correctly', () => {
    expect(isDemoUser('demo@prepflow.org')).toBe(true);
    expect(isDemoUser('DEMO@PREPFLOW.ORG')).toBe(true);
  });

  it('rejects non-demo users', () => {
    expect(isDemoUser('user@example.com')).toBe(false);
    expect(isDemoUser('')).toBe(false);
    expect(isDemoUser(null)).toBe(false);
    expect(isDemoUser(undefined)).toBe(false);
  });
});
