import { authOptions } from '@/lib/auth-options';
import { getEntitlementsForTier } from '@/lib/entitlements';
import { supabaseAdmin } from '@/lib/supabase';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const email = session.user.email as string;
  // Default tier until Stripe wiring
  const tier = 'starter' as const;
  const ent = getEntitlementsForTier(email, tier);
  if (!supabaseAdmin) {
    return NextResponse.json({ entitlements: ent, note: 'Supabase not available' });
  }
  try {
    const { error } = await supabaseAdmin
      .from('entitlements')
      .upsert(
        { user_email: email, tier: ent.tier, features: ent.features },
        { onConflict: 'user_email' },
      );
    if (error) {
      return NextResponse.json(
        { entitlements: ent, note: 'Upsert failed (table missing?)', details: error.message },
        { status: 501 },
      );
    }
    return NextResponse.json({ entitlements: ent });
  } catch (e: any) {
    return NextResponse.json(
      { entitlements: ent, note: 'Persistence error', details: String(e) },
      { status: 500 },
    );
  }
}
