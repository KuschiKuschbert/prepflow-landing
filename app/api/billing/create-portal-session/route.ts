import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { getOrCreateCustomerId } from '@/lib/billing';

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  if (!stripe) return NextResponse.json({ error: 'Stripe not configured' }, { status: 501 });
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const customerId = await getOrCreateCustomerId(session.user.email as string);
  if (!customerId)
    return NextResponse.json({ error: 'Unable to resolve customer' }, { status: 500 });
  const origin = req.headers.get('origin') || process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const portal = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${origin}/webapp/settings/billing`,
  });
  return NextResponse.json({ url: portal.url });
}
