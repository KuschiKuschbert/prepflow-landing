import { isEmailAllowed } from '../lib/allowlist';

describe('allowlist', () => {
  it('denies when env empty', () => {
    delete process.env.ALLOWED_EMAILS;
    expect(isEmailAllowed('user@example.com')).toBe(false);
  });
  it('allows listed email', () => {
    process.env.ALLOWED_EMAILS = 'user@example.com, second@example.com';
    expect(isEmailAllowed('user@example.com')).toBe(true);
    expect(isEmailAllowed('USER@example.com')).toBe(true);
    expect(isEmailAllowed('third@example.com')).toBe(false);
  });
});
