import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';

export async function POST() {
  const stripe = getStripe();
  if (!stripe) return NextResponse.json({ error: 'Stripe not configured' }, { status: 501 });
  // Stub: return placeholder until products/prices are ready
  return NextResponse.json({ url: null, message: 'Stripe products not configured yet' });
}
