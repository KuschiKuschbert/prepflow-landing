import { NextRequest, NextResponse } from 'next/server';
import { getAssignedVariant, getVariantForUser } from './lib/experiment';

export function middleware(request: NextRequest) {
  // Skip A/B testing for bots and crawlers
  const userAgent = request.headers.get('user-agent') || '';
  const isBot = /bot|crawler|spider|crawling/i.test(userAgent);
  if (isBot) return NextResponse.next();

  // Skip for static assets and API routes
  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/api') ||
    request.nextUrl.pathname.startsWith('/favicon') ||
    request.nextUrl.pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  if (request.nextUrl.pathname === '/') {
    const experimentKey = 'landing_ab_001';

    // Guarded rotation: only allow on localhost or with secret key
    const rotate = request.nextUrl.searchParams.get('rotate') === '1';
    const key = request.nextUrl.searchParams.get('key') || '';
    const host = request.headers.get('host') || '';
    const rotateAllowed = rotate && (host.startsWith('localhost') || key === (process.env.ROTATE_KEY || 'shkya'));

    // User ID
    let userId = request.cookies.get('pf_uid')?.value;
    if (!userId) userId = `pf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Manual override param
    const allowedVariants = ['control', 'v1', 'v2', 'v3'];
    const manualVariant = request.nextUrl.searchParams.get('variant');

    // Determine chosen variant
    let chosenVariant: string;
    if (manualVariant && allowedVariants.includes(manualVariant)) {
      chosenVariant = manualVariant;
    } else if (rotateAllowed) {
      // Regenerate user id to move hash bucket
      userId = `pf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      chosenVariant = getVariantForUser(userId, experimentKey);
    } else {
      chosenVariant = getAssignedVariant(request);
    }

    // Prepare rewritten URL without control params
    const url = request.nextUrl.clone();
    url.searchParams.set('variant', chosenVariant);
    if (rotateAllowed) {
      url.searchParams.delete('rotate');
      url.searchParams.delete('key');
    }

    // Create rewrite response and attach cookies/headers
    const response = NextResponse.rewrite(url);

    // Persist uid (1 year)
    response.cookies.set('pf_uid', userId, {
      maxAge: 60 * 60 * 24 * 365,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    // Variant cookie (30 days). If rotating, overwrite regardless.
    response.cookies.set(`pf_exp_${experimentKey}`, chosenVariant, {
      maxAge: 60 * 60 * 24 * 30,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    response.headers.set('x-ab-experiment', experimentKey);
    response.headers.set('x-ab-variant', chosenVariant);
    response.headers.set('x-ab-user-id', userId);

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
