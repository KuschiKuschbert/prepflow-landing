import { getEntitlementsForTierAsync } from '@/lib/entitlements';
import { supabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import { ApiErrorHandler } from '@/lib/api-error-handler';
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
        logger.error('[Entitlements API] Error fetching user tier, falling back to starter:', {
          error: error instanceof Error ? error.message : String(error),
          context: { endpoint: '/api/entitlements', method: 'GET', email },
        });
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
    return NextResponse.json(
      ApiErrorHandler.createError('Internal server error', 'SERVER_ERROR', 500),
      { status: 500 },
    );
  }
}
