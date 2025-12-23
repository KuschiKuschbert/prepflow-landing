import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Send notification to user 7 days before deletion
 */
export async function sendDeletionWarningNotification(
  userEmail: string,
  scheduledDeletionAt: Date,
): Promise<boolean> {
  try {
    const daysUntilDeletion = Math.ceil(
      (scheduledDeletionAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
    );

    if (daysUntilDeletion > 7) {
      return false;
    }

    if (!supabaseAdmin) {
      logger.warn('[Data Retention] Supabase admin not available, skipping warning check');
      return false;
    }

    const { data: deletionRecord } = await supabaseAdmin
      .from('account_deletions')
      .select('metadata')
      .eq('user_email', userEmail)
      .single();

    const metadata = (deletionRecord?.metadata as Record<string, unknown>) || {};
    if (metadata.warning_sent) {
      return true;
    }

    const { createNotification } = await import('@/lib/subscription-notifications');
    await createNotification({
      userEmail,
      type: 'system',
      title: 'Account Deletion Scheduled',
      message: `Your account will be permanently deleted in ${daysUntilDeletion} day${daysUntilDeletion !== 1 ? 's' : ''}. Export your data now if you want to keep it.`,
      actionUrl: '/webapp/settings',
      actionLabel: 'Export Data',
      expiresAt: scheduledDeletionAt,
      metadata: {
        daysUntilDeletion,
        scheduledDeletionAt: scheduledDeletionAt.toISOString(),
      },
    });

    await supabaseAdmin
      ?.from('account_deletions')
      .update({
        metadata: { ...metadata, warning_sent: true, warning_sent_at: new Date().toISOString() },
      })
      .eq('user_email', userEmail);

    logger.info('[Data Retention Cleanup] Deletion warning sent:', {
      userEmail,
      daysUntilDeletion,
    });

    return true;
  } catch (error) {
    logger.error('[Data Retention Cleanup] Failed to send deletion warning:', {
      error: error instanceof Error ? error.message : String(error),
      userEmail,
    });
    return false;
  }
}
