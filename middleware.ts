import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { isEmailAllowed } from '@/lib/allowlist';

export default async function middleware(req: NextRequest) {
  const { pathname, origin, search } = req.nextUrl;

  // Allow auth routes
  if (pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  // Development mode: Allow localhost to bypass authentication
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isLocalhost = origin.includes('localhost') || origin.includes('127.0.0.1');

  if (isDevelopment && isLocalhost) {
    // In development on localhost, allow access without authentication
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

  const email = (token as any)?.email as string | undefined;
  if (!isEmailAllowed(email)) {
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
