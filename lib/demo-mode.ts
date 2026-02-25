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
import { hasExistingData, runIfEmpty } from './demo-mode/runIfEmpty';

export const DEMO_EMAIL = 'demo@prepflow.org';

/**
 * Check if the given email belongs to the demo user.
 */
export function isDemoUser(email: string | null | undefined): boolean {
  if (!email) return false;
  return email.toLowerCase() === DEMO_EMAIL;
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
  const db = supabaseAdmin;

  logger.info('[Demo Mode] Starting demo account setup (additive mode)...', { email });

  try {
    const results = {
      cleaned: 0,
      populated: [] as Array<{ table: string; count: number }>,
      errors: [] as Array<{ table: string; error: string }>,
    };

    // --- Core data (these helpers already check for duplicates by name) ---
    const { ingredientsData, recipesData } = await populateBasicData(db, results);
    await populateStaff(db, results);

    await runIfEmpty(
      'kitchen_sections',
      () => populateKitchenSections(db, results),
      'Kitchen sections already exist, skipping.',
    );
    if (recipesData && ingredientsData) {
      await runIfEmpty(
        'dishes',
        () => populateDishes(db, results, recipesData, ingredientsData),
        'Dishes already exist, skipping.',
      );
    }
    if (recipesData && !(await hasExistingData('menu_dishes'))) {
      await populateMenuDishes(db, results, recipesData as any[]);
    }
    if (!(await hasExistingData('menus'))) {
      const { data: dishesData } = await db.from('dishes').select('id, dish_name');
      if (dishesData && recipesData) await populateMenus(db, results, dishesData, recipesData);
    } else {
      logger.info('[Demo Mode] Menus already exist, skipping.');
    }
    await runIfEmpty(
      'temperature_equipment',
      () => populateTemperatureData(db, results, 'AU'),
      'Temperature data already exists, skipping.',
    );
    await runIfEmpty(
      'cleaning_areas',
      () => populateCleaningData(db, results),
      'Cleaning data already exists, skipping.',
    );
    await runIfEmpty(
      'compliance_types',
      () => populateComplianceData(db, results),
      'Compliance data already exists, skipping.',
    );
    if (recipesData) {
      await runIfEmpty(
        'sales_data',
        () => populateSalesData(db, results, recipesData as any[]),
        'Sales data already exists, skipping.',
      );
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
    const { error: updateError } = await db
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
