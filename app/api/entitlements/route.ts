import { getEntitlementsForTierAsync } from '@/lib/entitlements';
import { supabaseAdmin } from '@/lib/supabase';
import type { TierSlug } from '@/lib/tier-config';
import { requireAuth } from '@/lib/auth0-api-helpers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    const email = user.email;

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
  } catch (error) {
    // requireAuth throws NextResponse, so rethrow it
    if (error instanceof NextResponse) {
      throw error;
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
