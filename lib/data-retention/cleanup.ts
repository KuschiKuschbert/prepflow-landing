/**
 * Data Retention - Cleanup
 * Deletes user accounts that have passed their 30-day retention period
 */

import { deleteTables } from '@/lib/backup/restore/helpers/delete-tables';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Get list of accounts due for deletion (scheduled_deletion_at <= now)
 * @returns Array of user emails due for deletion
 */
async function getAccountsDueForDeletion(): Promise<
  Array<{ user_email: string; scheduled_deletion_at: string; exported_at: string | null }>
> {
  if (!supabaseAdmin) {
    logger.warn('[Data Retention Cleanup] Supabase not available');
    return [];
  }

  try {
    const now = new Date().toISOString();

    const { data, error } = await supabaseAdmin
      .from('account_deletions')
      .select('user_email, scheduled_deletion_at, exported_at')
      .in('status', ['scheduled', 'exported'])
      .lte('scheduled_deletion_at', now)
      .order('scheduled_deletion_at', { ascending: true });

    if (error) {
      logger.error('[Data Retention Cleanup] Failed to get accounts due for deletion:', {
        error: error.message,
      });
      return [];
    }

    return data || [];
  } catch (error) {
    logger.error('[Data Retention Cleanup] Unexpected error getting accounts:', {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

/**
 * Delete all user data for a specific user
 * @param userEmail - User email
 * @returns Success status and deletion summary
 */
async function deleteUserData(userEmail: string): Promise<{
  success: boolean;
  deletedTables: string[];
  errors: string[];
}> {
  if (!supabaseAdmin) {
    logger.error('[Data Retention Cleanup] Supabase not available, cannot delete user data');
    return { success: false, deletedTables: [], errors: ['Database not available'] };
  }

  try {
    // Get user ID from email (users table uses email as identifier)
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('id, email')
      .eq('email', userEmail)
      .single();

    if (userError || !userData) {
      logger.warn('[Data Retention Cleanup] User not found:', {
        userEmail,
        error: userError?.message,
      });
      return { success: false, deletedTables: [], errors: ['User not found'] };
    }

    const userId = userEmail; // Use email as user_id in our system

    // List of tables with user_id column (from reset-self route and export logic)
    const tablesToDelete = [
      'order_lists',
      'prep_lists',
      'recipe_shares',
      'ai_specials_ingredients',
      // Add other user-specific tables as needed
      'ingredients',
      'recipes',
      'menu_dishes',
      'temperature_equipment',
      'temperature_logs',
      'cleaning_tasks',
      'compliance_records',
      'suppliers',
      'dish_sections',
      'par_levels',
    ];

    // Delete tables using existing deleteTables utility
    const errors = await deleteTables(supabaseAdmin, tablesToDelete, userId);

    // Delete child tables (order_list_items, prep_list_items)
    // These are handled by deleteTables via the parent table deletion

    // Delete user record itself (last, after all related data)
    const { error: deleteUserError } = await supabaseAdmin
      .from('users')
      .delete()
      .eq('email', userEmail);

    if (deleteUserError) {
      logger.error('[Data Retention Cleanup] Failed to delete user record:', {
        error: deleteUserError.message,
        userEmail,
      });
      errors.push(`Failed to delete user record: ${deleteUserError.message}`);
    }

    // Update account_deletions status
    await supabaseAdmin
      .from('account_deletions')
      .update({
        status: 'deleted',
        deleted_at: new Date().toISOString(),
      })
      .eq('user_email', userEmail);

    logger.info('[Data Retention Cleanup] User data deleted:', {
      userEmail,
      tablesDeleted: tablesToDelete.length,
      errors: errors.length,
    });

    return {
      success: errors.length === 0,
      deletedTables: tablesToDelete,
      errors,
    };
  } catch (error) {
    logger.error('[Data Retention Cleanup] Unexpected error deleting user data:', {
      error: error instanceof Error ? error.message : String(error),
      userEmail,
    });
    return {
      success: false,
      deletedTables: [],
      errors: [error instanceof Error ? error.message : 'Unknown error'],
    };
  }
}

/**
 * Send notification to user 7 days before deletion
 * @param userEmail - User email
 * @param scheduledDeletionAt - Scheduled deletion date
 * @returns Success status
 */
async function sendDeletionWarningNotification(
  userEmail: string,
  scheduledDeletionAt: Date,
): Promise<boolean> {
  try {
    const daysUntilDeletion = Math.ceil(
      (scheduledDeletionAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
    );

    if (daysUntilDeletion > 7) {
      // Not yet time for warning
      return false;
    }

    // Check if we've already sent a warning (via metadata)
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
      // Already sent warning
      return true;
    }

    // Send in-app notification
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

    // Mark warning as sent
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

/**
 * Process all accounts due for deletion
 * This should be called periodically (e.g., via cron job)
 * @returns Cleanup results
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

      // Send warning if 7 days before deletion
      if (scheduledDeletionAt.getTime() - now.getTime() <= 7 * 24 * 60 * 60 * 1000) {
        const warningSent = await sendDeletionWarningNotification(
          account.user_email,
          scheduledDeletionAt,
        );
        if (warningSent) {
          warningsSent++;
        }
      }

      // Delete if scheduled time has passed
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
