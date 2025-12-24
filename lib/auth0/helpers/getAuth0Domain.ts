/**
 * Extract domain from AUTH0_ISSUER_BASE_URL or use AUTH0_DOMAIN
 */
export function getAuth0Domain(): string | undefined {
  if (process.env.AUTH0_DOMAIN) {
    return process.env.AUTH0_DOMAIN.replace(/^https?:\/\//, '').replace(/\/$/, '');
  }

  if (process.env.AUTH0_ISSUER_BASE_URL) {
    return process.env.AUTH0_ISSUER_BASE_URL.replace(/^https?:\/\//, '').replace(/\/$/, '');
  }

  return undefined;
}
