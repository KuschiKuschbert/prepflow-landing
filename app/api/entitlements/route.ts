import { authOptions } from '@/lib/auth-options';
import { getEntitlementsForTierAsync } from '@/lib/entitlements';
import { supabaseAdmin } from '@/lib/supabase';
import type { TierSlug } from '@/lib/tier-config';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const email = session.user.email as string;

  // Get actual tier from database
  let tier: TierSlug = 'starter';
  if (supabaseAdmin) {
    try {
      const { data } = await supabaseAdmin
        .from('users')
        .select('subscription_tier')
        .eq('email', email)
        .maybeSingle();

      if (data?.subscription_tier) {
        tier = data.subscription_tier as TierSlug;
      }
    } catch (error) {
      // Fallback to starter on error
    }
  }

  // Get entitlements using database config (with code fallback)
  const ent = await getEntitlementsForTierAsync(email, tier);
  return NextResponse.json({ entitlements: ent });
}
