/* eslint-disable no-console */
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Client (Service Role for admin checks)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function checkSubscription(email: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('subscription_tier')
      .eq('email', email)
      .single();

    if (error || !data) {
      console.error('Subscription check failed', error);
      return false;
    }

    const tier = data.subscription_tier;
    // Allow 'business' tier (and implicit admins/internal if needed)
    return tier === 'business';
  } catch (e) {
    console.error('Subscription check exception', e);
    return false;
  }
}
