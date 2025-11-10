import { isEmailAllowed } from '@/lib/allowlist';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export default async function middleware(req: NextRequest) {
  const { pathname, origin, search } = req.nextUrl;
  const isProduction = process.env.NODE_ENV === 'production';
  const authConfigured = Boolean(
    process.env.NEXTAUTH_SECRET &&
      process.env.AUTH0_ISSUER_BASE_URL &&
      process.env.AUTH0_CLIENT_ID &&
      process.env.AUTH0_CLIENT_SECRET,
  );

  // Always allow auth and selected public APIs
  if (pathname.startsWith('/api/auth') || pathname.startsWith('/api/leads')) {
    return NextResponse.next();
  }

  // Skip all auth checks in development or if auth is not configured
  if (!isProduction || !authConfigured) {
    return NextResponse.next();
  }

  // Production: Require authentication
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const isApi = pathname.startsWith('/api/');

  if (!token) {
    if (isApi) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const callback = encodeURIComponent(pathname + (search || ''));
    return NextResponse.redirect(`${origin}/api/auth/signin/auth0?callbackUrl=${callback}`);
  }

  // Check allowlist only in production
  // In development, all authenticated users are allowed (early return above handles this)
  const email = (token as any)?.email as string | undefined;
  if (isProduction && !isEmailAllowed(email)) {
    if (isApi) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.redirect(`${origin}/not-authorized`);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/webapp/:path*', '/api/:path*'],
};
