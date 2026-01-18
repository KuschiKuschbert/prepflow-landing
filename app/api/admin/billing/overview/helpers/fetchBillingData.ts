import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { PostgrestError } from '@supabase/supabase-js';

export async function fetchBillingStats() {
  if (!supabaseAdmin) {
    return {
      activeSubscriptions: 0,
      trialSubscriptions: 0,
      cancelledSubscriptions: 0,
    };
  }

  const [activeRes, trialRes, cancelledRes] = await Promise.all([
    supabaseAdmin
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('subscription_status', 'active'),
    supabaseAdmin
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('subscription_status', 'trial'),
    supabaseAdmin
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('subscription_status', 'cancelled'),
  ]);

  if (activeRes.error) {
    logger.warn('[Admin Billing Overview] Error fetching active subscriptions count:', {
      error: activeRes.error.message,
      code: (activeRes.error as PostgrestError).code,
    });
  }

  if (trialRes.error) {
    logger.warn('[Admin Billing Overview] Error fetching trial subscriptions count:', {
      error: trialRes.error.message,
      code: (trialRes.error as PostgrestError).code,
    });
  }

  if (cancelledRes.error) {
    logger.warn('[Admin Billing Overview] Error fetching cancelled subscriptions count:', {
      error: cancelledRes.error.message,
      code: (cancelledRes.error as PostgrestError).code,
    });
  }

  return {
    activeSubscriptions: activeRes.count || 0,
    trialSubscriptions: trialRes.count || 0,
    cancelledSubscriptions: cancelledRes.count || 0,
  };
}
