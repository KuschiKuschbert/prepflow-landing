import { logger } from '@/lib/logger';
import {
    populateBasicData,
    populateCleaningData,
    populateComplianceData,
    populateDishes,
    populateKitchenSections,
    populateMenuDishes,
    populateMenus,
    populateSalesData,
    populateStaff,
    populateTemperatureData,
} from '@/lib/populate-helpers';
import { supabaseAdmin } from '@/lib/supabase';

export const DEMO_EMAIL = 'demo@prepflow.org';

/**
 * Check if the given email belongs to the demo user.
 */
export function isDemoUser(email: string | null | undefined): boolean {
  if (!email) return false;
  return email.toLowerCase() === DEMO_EMAIL;
}

/**
 * Check if a table already has data (to avoid duplicate inserts).
 */
async function hasExistingData(table: string): Promise<boolean> {
  if (!supabaseAdmin) return false;
  const { data, error } = await supabaseAdmin.from(table).select('id').limit(1);
  if (error) {
    logger.warn(`[Demo Mode] Error checking ${table}:`, { error: error.message });
    return false;
  }
  return (data?.length ?? 0) > 0;
}

/**
 * Set up the demo account with sample data (ADDITIVE — never deletes existing data).
 *
 * This function is called on every demo user login. It:
 *  1. Ensures sample data exists (skips tables that already have data)
 *  2. Ensures the demo user has 'business' tier and 'verified' status
 *
 * IMPORTANT: We intentionally do NOT call cleanExistingData() here.
 * The old implementation wiped ALL rows from every table globally (no user scoping),
 * which destroyed production data for all users. Since multi-tenancy data
 * segregation is not yet enforced via RLS, a global wipe is destructive.
 */
export async function setupDemoAccount(email: string): Promise<void> {
  if (!isDemoUser(email)) {
    logger.error('[Demo Mode] Attempted to setup demo account for non-demo user', { email });
    return;
  }

  if (!supabaseAdmin) {
    logger.error('[Demo Mode] Database connection not available');
    throw new Error('Database connection not available');
  }

  logger.info('[Demo Mode] Starting demo account setup (additive mode)...', { email });

  try {
    const results = {
      cleaned: 0,
      populated: [] as Array<{ table: string; count: number }>,
      errors: [] as Array<{ table: string; error: string }>,
    };

    // --- Core data (these helpers already check for duplicates by name) ---
    const { ingredientsData, recipesData } = await populateBasicData(supabaseAdmin, results);
    await populateStaff(supabaseAdmin, results);

    // Kitchen sections (check before inserting — no built-in duplicate detection)
    if (!(await hasExistingData('kitchen_sections'))) {
      await populateKitchenSections(supabaseAdmin, results);
    } else {
      logger.info('[Demo Mode] Kitchen sections already exist, skipping.');
    }

    // Dishes (helpers check for existing dishes by name)
    if (recipesData && ingredientsData) {
      if (!(await hasExistingData('dishes'))) {
        await populateDishes(supabaseAdmin, results, recipesData, ingredientsData);
      } else {
        logger.info('[Demo Mode] Dishes already exist, skipping.');
      }
    }

    // Menu dishes — legacy system (no built-in duplicate detection)
    if (recipesData && !(await hasExistingData('menu_dishes'))) {
      await populateMenuDishes(supabaseAdmin, results, recipesData as any[]);
    }

    // Menus (no built-in duplicate detection)
    if (!(await hasExistingData('menus'))) {
      const { data: dishesData } = await supabaseAdmin.from('dishes').select('id, dish_name');
      if (dishesData && recipesData) {
        await populateMenus(supabaseAdmin, results, dishesData, recipesData);
      }
    } else {
      logger.info('[Demo Mode] Menus already exist, skipping.');
    }

    // --- Operational data (no built-in duplicate detection — check first) ---

    if (!(await hasExistingData('temperature_equipment'))) {
      await populateTemperatureData(supabaseAdmin, results, 'AU');
    } else {
      logger.info('[Demo Mode] Temperature data already exists, skipping.');
    }

    if (!(await hasExistingData('cleaning_areas'))) {
      await populateCleaningData(supabaseAdmin, results);
    } else {
      logger.info('[Demo Mode] Cleaning data already exists, skipping.');
    }

    if (!(await hasExistingData('compliance_types'))) {
      await populateComplianceData(supabaseAdmin, results);
    } else {
      logger.info('[Demo Mode] Compliance data already exists, skipping.');
    }

    // Sales data (uses upsert internally, safe to call)
    if (recipesData && !(await hasExistingData('sales_data'))) {
      await populateSalesData(supabaseAdmin, results, recipesData as any[]);
    } else {
      logger.info('[Demo Mode] Sales data already exists, skipping.');
    }

    // --- Log results ---
    const totalPopulated = results.populated.reduce((sum, item) => sum + item.count, 0);

    if (totalPopulated > 0) {
      logger.info(`[Demo Mode] Added ${totalPopulated} sample records.`, {
        tables: results.populated.map(p => `${p.table}: ${p.count}`),
      });
    } else {
      logger.info('[Demo Mode] All sample data already exists, nothing to add.');
    }

    if (results.errors.length > 0) {
      logger.warn('[Demo Mode] Some tables had errors during population:', {
        errors: results.errors,
      });
    }

    // --- Ensure User Permissions (Business Tier + Verified) ---
    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({
        subscription_tier: 'business',
        email_verified: true,
        updated_at: new Date().toISOString(),
      })
      .eq('email', email);

    if (updateError) {
      throw updateError;
    }

    logger.info('[Demo Mode] Demo account setup complete. Tier set to Business.');
  } catch (error) {
    logger.error('[Demo Mode] Failed to setup demo account:', {
      error: error instanceof Error ? error.message : String(error),
    });
    // We don't throw here to avoid completely blocking login,
    // but the user might see a broken state.
  }
}
