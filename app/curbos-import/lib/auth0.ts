import { Auth0Client } from '@auth0/nextjs-auth0/server';

const isBuild = process.env.NEXT_PHASE === 'phase-production-build';

export const auth0 = new Auth0Client({
  appBaseUrl: process.env.AUTH0_BASE_URL || 'http://localhost:3000',
  secret: process.env.AUTH0_SECRET || 'fallback_secret_for_build_only_32_chars',
  domain:
    process.env.AUTH0_DOMAIN ||
    process.env.AUTH0_ISSUER_BASE_URL?.replace('https://', '') ||
    'example.auth0.com',
  clientId: process.env.AUTH0_CLIENT_ID || 'placeholder',
  clientSecret: process.env.AUTH0_CLIENT_SECRET || 'placeholder',
  routes: {
    callback: '/api/auth/callback',
  },
  session: {
    absoluteDuration: 60 * 60 * 24 * 7, // 7 days
  },
});
