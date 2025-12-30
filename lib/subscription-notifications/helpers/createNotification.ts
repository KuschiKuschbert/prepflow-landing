/**
 * Create a notification for a user.
 */
import { logger } from '../../logger';
import { supabaseAdmin } from '../../supabase';
import type { CreateNotificationParams } from '../types';

/**
 * Create a notification for a user.
 * Stores notification in database and can trigger in-app toast.
 */
export async function createNotification(params: CreateNotificationParams): Promise<string | null> {
  if (!supabaseAdmin) {
    logger.warn('[Subscription Notifications] Supabase not available, cannot create notification');
    return null;
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('user_notifications')
      .insert({
        user_email: params.userEmail,
        type: params.type,
        title: params.title,
        message: params.message,
        action_url: params.actionUrl || null,
        action_label: params.actionLabel || null,
        expires_at: params.expiresAt?.toISOString() || null,
        metadata: params.metadata || null,
      })
      .select('id')
      .single();

    if (error) {
      logger.error('[Subscription Notifications] Failed to create notification:', {
        error: error.message,
        params,
      });
      return null;
    }

    logger.dev('[Subscription Notifications] Created notification:', {
      id: data.id,
      userEmail: params.userEmail,
      type: params.type,
    });

    return data.id;
  } catch (error) {
    logger.error('[Subscription Notifications] Unexpected error creating notification:', {
      error: error instanceof Error ? error.message : String(error),
      params,
    });
    return null;
  }
}




