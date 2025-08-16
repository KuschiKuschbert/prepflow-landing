import { NextRequest, NextResponse } from 'next/server';
import { getAssignedVariant, getVariantForUser } from './lib/experiment';

export function middleware(request: NextRequest) {
  const userAgent = request.headers.get('user-agent') || '';
  const isBot = /bot|crawler|spider|crawling/i.test(userAgent);
  if (isBot) return NextResponse.next();

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

    const rotateParam = request.nextUrl.searchParams.get('rotate');
    const rotateStepsRaw = Number(rotateParam);
    const rotateSteps = isNaN(rotateStepsRaw) ? (rotateParam ? 1 : 0) : Math.max(1, Math.floor(rotateStepsRaw));
    const key = request.nextUrl.searchParams.get('key') || '';
    const host = request.headers.get('host') || '';
    const rotateAllowed = !!rotateParam && (host.startsWith('localhost') || key === (process.env.ROTATE_KEY || 'shkya'));

    let userId = request.cookies.get('pf_uid')?.value;
    if (!userId) userId = `pf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const allowedVariants = ['control', 'v1', 'v2', 'v3'] as const;
    const manualVariant = request.nextUrl.searchParams.get('variant');

    let chosenVariant: string;
    if (manualVariant && (allowedVariants as unknown as string[]).includes(manualVariant)) {
      chosenVariant = manualVariant;
    } else if (rotateAllowed) {
      const currentCookie = request.cookies.get(`pf_exp_${experimentKey}`)?.value as string | undefined;
      if (currentCookie && (allowedVariants as unknown as string[]).includes(currentCookie)) {
        const idx = (allowedVariants as unknown as string[]).indexOf(currentCookie);
        const nextIdx = (idx + rotateSteps) % allowedVariants.length;
        chosenVariant = (allowedVariants as unknown as string[])[nextIdx];
      } else {
        userId = `pf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        chosenVariant = getVariantForUser(userId, experimentKey);
      }
    } else {
      chosenVariant = getAssignedVariant(request);
    }

    const url = request.nextUrl.clone();
    url.searchParams.set('variant', chosenVariant);
    if (rotateAllowed) {
      url.searchParams.delete('rotate');
      url.searchParams.delete('key');
    }

    // Build response: redirect for rotation (to ensure URL updates), rewrite otherwise
    const response = rotateAllowed ? NextResponse.redirect(url) : NextResponse.rewrite(url);

    // Persist uid
    response.cookies.set('pf_uid', userId, {
      maxAge: 60 * 60 * 24 * 365,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    // Variant cookie
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
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
