import NextAuth from 'next-auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { authOptions } from '@/lib/auth-options';

const nextAuthHandler = NextAuth(authOptions);

export async function GET(req: NextRequest): Promise<Response> {
  try {
    // Delegate to NextAuth
    // @ts-expect-error – NextAuth handler is compatible with route handlers
    return await nextAuthHandler(req);
  } catch (error) {
    console.error('NextAuth GET error:', error);
    const url = new URL('/webapp', req.url);
    url.searchParams.set('auth_error', '1');
    return NextResponse.redirect(url);
  }
}

export async function POST(req: NextRequest): Promise<Response> {
  try {
    // Delegate to NextAuth
    // @ts-expect-error – NextAuth handler is compatible with route handlers
    return await nextAuthHandler(req);
  } catch (error) {
    console.error('NextAuth POST error:', error);
    const url = new URL('/webapp', req.url);
    url.searchParams.set('auth_error', '1');
    return NextResponse.redirect(url);
  }
}
