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
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const isApi = pathname.startsWith('/api/');
  if (!token) {
    if (isApi) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const callback = encodeURIComponent(pathname + (search || ''));
    return NextResponse.redirect(`${origin}/api/auth/signin?callbackUrl=${callback}`);
  }
  const email = (token as any)?.email as string | undefined;
  if (!isEmailAllowed(email)) {
    if (isApi) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return new NextResponse('Forbidden', { status: 403 });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/webapp/:path*', '/api/:path*'],
};
