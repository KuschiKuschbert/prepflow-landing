/**
 * Data Retention - Cleanup
 * Deletes user accounts that have passed their 30-day retention period
 */

import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { getAccountsDueForDeletion } from './cleanup/helpers/getAccountsDueForDeletion';
import { deleteUserData } from './cleanup/helpers/deleteUserData';
import { sendDeletionWarningNotification } from './cleanup/helpers/sendDeletionWarning';

/**
 * Process all accounts due for deletion
 */
export async function processAccountDeletions(): Promise<{
  processed: number;
  deleted: number;
  failed: number;
  warningsSent: number;
}> {
  if (!supabaseAdmin) {
    logger.warn('[Data Retention Cleanup] Supabase not available, cannot process deletions');
    return { processed: 0, deleted: 0, failed: 0, warningsSent: 0 };
  }

  try {
    const accountsDue = await getAccountsDueForDeletion();

    if (accountsDue.length === 0) {
      return { processed: 0, deleted: 0, failed: 0, warningsSent: 0 };
    }

    let deleted = 0;
    let failed = 0;
    let warningsSent = 0;

    for (const account of accountsDue) {
      const scheduledDeletionAt = new Date(account.scheduled_deletion_at);
      const now = new Date();

      if (scheduledDeletionAt.getTime() - now.getTime() <= 7 * 24 * 60 * 60 * 1000) {
        const warningSent = await sendDeletionWarningNotification(
          account.user_email,
          scheduledDeletionAt,
        );
        if (warningSent) {
          warningsSent++;
        }
      }

      if (scheduledDeletionAt <= now) {
        const result = await deleteUserData(account.user_email);

        if (result.success) {
          deleted++;
        } else {
          failed++;
          logger.error('[Data Retention Cleanup] Failed to delete account:', {
            userEmail: account.user_email,
            errors: result.errors,
          });
        }
      }
    }

    logger.info('[Data Retention Cleanup] Processed account deletions:', {
      processed: accountsDue.length,
      deleted,
      failed,
      warningsSent,
    });

    return {
      processed: accountsDue.length,
      deleted,
      failed,
      warningsSent,
    };
  } catch (error) {
    logger.error('[Data Retention Cleanup] Unexpected error processing deletions:', {
      error: error instanceof Error ? error.message : String(error),
    });
    return { processed: 0, deleted: 0, failed: 0, warningsSent: 0 };
  }
}
