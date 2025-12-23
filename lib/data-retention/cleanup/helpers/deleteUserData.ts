import { deleteTables } from '@/lib/backup/restore/helpers/delete-tables';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Delete all user data for a specific user
 */
export async function deleteUserData(userEmail: string): Promise<{
  success: boolean;
  deletedTables: string[];
  errors: string[];
}> {
  if (!supabaseAdmin) {
    logger.error('[Data Retention Cleanup] Supabase not available, cannot delete user data');
    return { success: false, deletedTables: [], errors: ['Database not available'] };
  }

  try {
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

    const userId = userEmail;

    const tablesToDelete = [
      'order_lists',
      'prep_lists',
      'recipe_shares',
      'ai_specials_ingredients',
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

    const errors = await deleteTables(supabaseAdmin, tablesToDelete, userId);

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

