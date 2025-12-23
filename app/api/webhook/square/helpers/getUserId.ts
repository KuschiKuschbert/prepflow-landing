import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Extract user ID from webhook event
 * Square webhooks include location_id, which we can use to find the user
 *
 * @param {any} event - Webhook event data
 * @returns {Promise<string | null>} User ID or null if not found
 */
export async function getUserIdFromEvent(event: any): Promise<string | null> {
  try {
    // Square webhooks include location_id in the event
    const locationId = event.data?.object?.location_id || event.location_id;

    if (!locationId) {
      logger.warn('[Square Webhook] No location_id in event');
      return null;
    }

    // Find user by location_id in square_configurations
    if (!supabaseAdmin) {
      return null;
    }

    const { data, error } = await supabaseAdmin
      .from('square_configurations')
      .select('user_id')
      .eq('default_location_id', locationId)
      .limit(1)
      .single();

    if (error || !data) {
      logger.warn('[Square Webhook] No user found for location_id:', {
        locationId,
        error: error?.message,
      });
      return null;
    }

    return data.user_id;
  } catch (error: any) {
    logger.error('[Square Webhook] Error extracting user ID:', {
      error: error.message,
    });
    return null;
  }
}


