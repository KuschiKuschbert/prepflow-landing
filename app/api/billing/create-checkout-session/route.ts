import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { getOrCreateCustomerId, resolvePriceIdFromTier } from '@/lib/billing';

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  if (!stripe) return NextResponse.json({ error: 'Stripe not configured' }, { status: 501 });
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const priceId: string | null = body.priceId || resolvePriceIdFromTier(body.tier);
  if (!priceId) return NextResponse.json({ error: 'Missing priceId/tier' }, { status: 400 });
  const customerId = await getOrCreateCustomerId(session.user.email as string);
  if (!customerId)
    return NextResponse.json({ error: 'Unable to resolve customer' }, { status: 500 });
  const origin = req.headers.get('origin') || process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const checkout = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${origin}/webapp/settings/billing?status=success`,
    cancel_url: `${origin}/webapp/settings/billing?status=cancelled`,
  });
  return NextResponse.json({ url: checkout.url });
}
