/**
 * Get mock dev user for development bypass mode
 */
export function getDevUser() {
  return {
    email: 'dev@prepflow.org',
    name: 'Dev User',
    sub: 'dev|123',
    roles: ['admin'],
    email_verified: true,
  };
}
