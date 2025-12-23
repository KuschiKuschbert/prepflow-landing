import { supabaseAdmin } from './supabase';
import { logger } from './logger';

const DEFAULT_TRIAL_DAYS = 7;

/**
 * Get trial days from environment or use default.
 */
function getTrialDays(): number {
  const envDays = process.env.TRIAL_DAYS;
  if (envDays) {
    const parsed = parseInt(envDays, 10);
    if (!isNaN(parsed) && parsed > 0) {
      return parsed;
    }
  }
  return DEFAULT_TRIAL_DAYS;
}

/**
 * Check if user has an active trial.
 */
export async function isTrialActive(userEmail: string): Promise<boolean> {
  if (!supabaseAdmin) return false;

  try {
    const { data } = await supabaseAdmin
      .from('users')
      .select('subscription_status, subscription_expires')
      .eq('email', userEmail)
      .maybeSingle();

    if (!data) return false;

    // Check if status is trial
    if (data.subscription_status !== 'trial') return false;

    // Check if trial hasn't expired
    if (data.subscription_expires) {
      const expiresAt = new Date(data.subscription_expires);
      return expiresAt > new Date();
    }

    return true;
  } catch (error) {
    logger.warn('[Trial Utils] Error checking trial status:', {
      error: error instanceof Error ? error.message : String(error),
      userEmail,
    });
    return false;
  }
}

/**
 * Get number of days remaining in trial.
 */
export async function getTrialDaysRemaining(userEmail: string): Promise<number> {
  if (!supabaseAdmin) return 0;

  try {
    const { data } = await supabaseAdmin
      .from('users')
      .select('subscription_expires')
      .eq('email', userEmail)
      .maybeSingle();

    if (!data?.subscription_expires) {
      // No expiration set, check if user is in trial
      const isTrial = await isTrialActive(userEmail);
      if (isTrial) {
        // Return default trial days
        return getTrialDays();
      }
      return 0;
    }

    const expiresAt = new Date(data.subscription_expires);
    const now = new Date();
    const diffMs = expiresAt.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    return Math.max(0, diffDays);
  } catch (error) {
    logger.warn('[Trial Utils] Error getting trial days remaining:', {
      error: error instanceof Error ? error.message : String(error),
      userEmail,
    });
    return 0;
  }
}

/**
 * Get trial end date.
 */
export async function getTrialEndDate(userEmail: string): Promise<Date | null> {
  if (!supabaseAdmin) return null;

  try {
    const { data } = await supabaseAdmin
      .from('users')
      .select('subscription_expires')
      .eq('email', userEmail)
      .maybeSingle();

    if (!data?.subscription_expires) {
      // Calculate trial end date if not set
      const trialDays = getTrialDays();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + trialDays);
      return endDate;
    }

    return new Date(data.subscription_expires);
  } catch (error) {
    logger.warn('[Trial Utils] Error getting trial end date:', {
      error: error instanceof Error ? error.message : String(error),
      userEmail,
    });
    return null;
  }
}

/**
 * Initialize trial for a new user.
 */
export async function initializeTrial(userEmail: string): Promise<void> {
  if (!supabaseAdmin) return;

  try {
    const trialDays = getTrialDays();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + trialDays);

    const { error } = await supabaseAdmin
      .from('users')
      .update({
        subscription_status: 'trial',
        subscription_tier: 'starter',
        subscription_expires: expiresAt.toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('email', userEmail);

    if (error) {
      logger.error('[Trial Utils] Failed to initialize trial:', {
        error: error.message,
        userEmail,
      });
      throw error;
    }
  } catch (error) {
    logger.error('[Trial Utils] Error initializing trial:', {
      error: error instanceof Error ? error.message : String(error),
      userEmail,
    });
    throw error;
  }
}
