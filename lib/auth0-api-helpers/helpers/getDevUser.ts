/**
 * Get mock dev user for development bypass mode
 */
export function getDevUser() {
  return {
    email: 'derkusch@gmail.com',
    name: 'Daniel Kuschmierz',
    sub: 'dev|123',
    roles: ['admin'],
    email_verified: true,
  };
}
