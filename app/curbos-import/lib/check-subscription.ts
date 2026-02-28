import { logger } from '@/lib/logger';
import { createSupabaseAdmin } from '@/lib/supabase';

// Lazy client - defer to first use so build succeeds without env vars
let _supabase: ReturnType<typeof createSupabaseAdmin> | null = null;
function getSupabase() {
  if (!_supabase) {
    try {
      _supabase = createSupabaseAdmin();
    } catch {
      return null;
    }
  }
  return _supabase;
}

export async function checkSubscription(email: string): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) {
    logger.error('[CurbOS] Supabase not configured for subscription check');
    return false;
  }
  try {
    const { data, error } = await supabase
      .from('users')
      .select('subscription_tier')
      .eq('email', email)
      .single();

    if (error || !data) {
      logger.error('[CurbOS] Subscription check failed', { error });
      return false;
    }

    const tier = data.subscription_tier;
    // Allow 'business' tier (and implicit admins/internal if needed)
    return tier === 'business';
  } catch (e) {
    logger.error('[CurbOS] Subscription check exception', { error: e });
    return false;
  }
}
