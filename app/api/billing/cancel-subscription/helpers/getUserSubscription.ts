import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';

interface UserSubscriptionData {
  stripe_subscription_id: string;
  subscription_tier: string;
  subscription_expires: string | null;
}

/**
 * Get user's subscription data from database
 *
 * @param {string} userEmail - User email address
 * @returns {Promise<UserSubscriptionData | NextResponse>} User subscription data or error response
 */
export async function getUserSubscription(
  userEmail: string,
): Promise<UserSubscriptionData | NextResponse> {
  if (!supabaseAdmin) {
    return NextResponse.json(
      ApiErrorHandler.createError('Database not available', 'DATABASE_ERROR', 500),
      { status: 500 },
    );
  }

  const { data: userData, error: userError } = await supabaseAdmin
    .from('users')
    .select('stripe_subscription_id, subscription_tier, subscription_expires')
    .eq('email', userEmail)
    .single();

  if (userError || !userData?.stripe_subscription_id) {
    logger.warn('[Billing API] User has no active subscription:', {
      userEmail,
      error: userError?.message,
      code: userError?.code,
    });
    return NextResponse.json(
      ApiErrorHandler.createError('No active subscription found', 'SUBSCRIPTION_NOT_FOUND', 404),
      { status: 404 },
    );
  }

  return userData as UserSubscriptionData;
}
