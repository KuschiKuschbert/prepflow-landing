import { NextRequest, NextResponse } from 'next/server';

/**
 * Security Headers Utility
 * Injects modern security headers into NexResponse
 */
export function applySecurityHeaders(request: NextRequest, response: NextResponse): NextResponse {
  // 1. Content Security Policy (CSP)
  // We use a permissive but structured CSP to allow Auth0, Supabase, and Google Fonts
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' *.auth0.com *.googletagmanager.com https://va.vercel-scripts.com;
    style-src 'self' 'unsafe-inline' fonts.googleapis.com;
    img-src 'self' blob: data: https: *.auth0.com *.googleusercontent.com *.gravatar.com *.supabase.co *.allrecipes.com *.foodnetwork.com *.epicurious.com *.bonappetit.com *.tasty.co *.seriouseats.com *.food52.com *.simplyrecipes.com *.smittenkitchen.com *.thekitchn.com *.delish.com *.cloudinary.com *.imgix.net *.amazonaws.com;
    font-src 'self' fonts.gstatic.com;
    connect-src 'self' https: wss: *.auth0.com *.supabase.co wss://*.supabase.co https://*.supabase.co/realtime/v1/websocket *.google-analytics.com https://vercel.live;
    frame-src 'self' *.auth0.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self' *.auth0.com;
    frame-ancestors 'none';
    ${process.env.NODE_ENV === 'production' && process.env.VERCEL ? 'upgrade-insecure-requests;' : ''}
  `
    .replace(/\s{2,}/g, ' ')
    .trim();

  // 2. Security Headers
  response.headers.set('Content-Security-Policy', cspHeader);
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  );

  // 3. Strict-Transport-Security (HSTS) - 2 years
  // Only include HSTS in actual production deployments (Vercel)
  // This prevents HSTS redirects on localhost which block Lighthouse audits
  if (process.env.NODE_ENV === 'production' && process.env.VERCEL) {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=63072000; includeSubDomains; preload',
    );
  }

  return response;
}
