import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const auth0Issuer = process.env.AUTH0_ISSUER_BASE_URL;
  const clientId = process.env.AUTH0_CLIENT_ID;
  const returnTo = request.nextUrl.searchParams.get('returnTo') || '/not-authorized';

  if (!auth0Issuer || !clientId) {
    // If env vars not available, just redirect to returnTo
    return NextResponse.redirect(new URL(returnTo, request.url));
  }

  // Construct Auth0 logout URL
  const logoutUrl = `${auth0Issuer}/v2/logout?client_id=${clientId}&returnTo=${encodeURIComponent(
    new URL(returnTo, request.url).toString(),
  )}`;

  return NextResponse.redirect(logoutUrl);
}
