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
    // Get or create user ID
    let userId = request.cookies.get('pf_uid')?.value;
    if (!userId) {
      userId = `pf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    // Allow manual override via query param for development/debugging
    const allowedVariants = ['control', 'v1', 'v2', 'v3'];
    const manualVariant = request.nextUrl.searchParams.get('variant');
    const experimentKey = 'landing_ab_001';
    const chosenVariant = manualVariant && allowedVariants.includes(manualVariant)
      ? manualVariant
      : getAssignedVariant(request);

    // Create response with A/B testing variants
    const response = NextResponse.next();
    
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

    return NextResponse.rewrite(url);
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
