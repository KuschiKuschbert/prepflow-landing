import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getCurrentPrice } from '../../../lib/pricing';

export async function GET(request: NextRequest) {
  const experimentKey = 'landing_ab_001';
  const cookieStore = cookies();
  const cookieVariant = cookieStore.get(`pf_exp_${experimentKey}`)?.value;
  const headerVariant = request.headers.get('x-ab-variant') || undefined;
  const variant = headerVariant || cookieVariant || 'control';

  const { price, url } = getCurrentPrice();

  // Fire a server-side tracking ping to our local events endpoint
  try {
    const eventsUrl = new URL('/api/events', request.url);
    await fetch(eventsUrl.toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'gumroad_landing',
        timestamp: Date.now(),
        properties: {
          experiment: experimentKey,
          variant,
          destination: 'gumroad',
          amount: price,
          currency: 'AUD'
        }
      })
    });
  } catch {}

  // Append basic attribution parameters for Gumroad
  const redirectUrl = new URL(url);
  redirectUrl.searchParams.set('utm_source', 'prepflow');
  redirectUrl.searchParams.set('utm_medium', 'redirect');
  redirectUrl.searchParams.set('utm_campaign', experimentKey);
  redirectUrl.searchParams.set('variant', variant);
  redirectUrl.searchParams.set('price', String(price));

  const response = NextResponse.redirect(redirectUrl, 302);
  response.headers.set('x-ab-experiment', experimentKey);
  response.headers.set('x-ab-variant', variant);
  return response;
}

export const dynamic = 'force-dynamic';

