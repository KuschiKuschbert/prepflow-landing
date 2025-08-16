import { NextRequest, NextResponse } from 'next/server';
import { getAssignedVariant } from './lib/experiment';

export function middleware(request: NextRequest) {
  // Skip A/B testing for bots and crawlers
  const userAgent = request.headers.get('user-agent') || '';
  const isBot = /bot|crawler|spider|crawling/i.test(userAgent);
  
  if (isBot) {
    return NextResponse.next();
  }

  // Skip A/B testing for static assets and API routes
  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/api') ||
    request.nextUrl.pathname.startsWith('/favicon') ||
    request.nextUrl.pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Only run A/B testing on the main landing page
  if (request.nextUrl.pathname === '/') {
    // Guarded rotation: only allow on localhost or with secret key
    const rotate = request.nextUrl.searchParams.get('rotate') === '1';
    const key = request.nextUrl.searchParams.get('key') || '';
    const host = request.headers.get('host') || '';
    const rotateAllowed = rotate && (
      host.startsWith('localhost') ||
      key === (process.env.ROTATE_KEY || 'shkya')
    );

    // Get or create user ID
    let userId = request.cookies.get('pf_uid')?.value;
    if (!userId) {
      userId = `pf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    // Allow manual override via query param for development/debugging
    const allowedVariants = ['control', 'v1', 'v2', 'v3'];
    const manualVariant = request.nextUrl.searchParams.get('variant');
    const experimentKey = 'landing_ab_001';

    // If rotation is allowed, drop existing cookies to force reassignment
    const response = NextResponse.next();

    if (rotateAllowed) {
      response.cookies.delete(`pf_exp_${experimentKey}`);
      // Regenerate user id for a different hash bucket
      userId = `pf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      response.cookies.set('pf_uid', userId, {
        maxAge: 60 * 60 * 24 * 365,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });
      const clean = request.nextUrl.clone();
      clean.searchParams.delete('rotate');
      clean.searchParams.delete('key');
      request = new NextRequest(clean, { headers: request.headers });
    }

    const chosenVariant = manualVariant && allowedVariants.includes(manualVariant)
      ? manualVariant
      : getAssignedVariant(request);

    // Set user ID cookie for consistency (1 year)
    response.cookies.set('pf_uid', userId, {
      maxAge: 60 * 60 * 24 * 365,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    // Set experiment variant cookie (30 days) - persists manual or assigned variant
    response.cookies.set(`pf_exp_${experimentKey}`, chosenVariant, {
      maxAge: 60 * 60 * 24 * 30,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    // Add A/B testing headers for tracking and debugging
    response.headers.set('x-ab-experiment', experimentKey);
    response.headers.set('x-ab-variant', chosenVariant);
    response.headers.set('x-ab-user-id', userId);

    // Add A/B testing data to the request for the page component
    const url = request.nextUrl.clone();
    url.searchParams.set('variant', chosenVariant);
    if (rotateAllowed) {
      url.searchParams.delete('rotate');
      url.searchParams.delete('key');
    }

    return NextResponse.rewrite(url, response);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
