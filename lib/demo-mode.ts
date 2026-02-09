import { logger } from '@/lib/logger';
import {
  cleanExistingData,
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
 * Reset and repopulate the demo account with fresh data.
 * Sets the user to 'business' tier and 'verified' status.
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

  logger.info('[Demo Mode] Starting demo account reset...', { email });

  try {
    // 1. Clean existing data
    await cleanExistingData(supabaseAdmin);
    logger.info('[Demo Mode] Data cleaned.');

    // 2. Repopulate data
    const results = {
      cleaned: 0,
      populated: [] as Array<{ table: string; count: number }>,
      errors: [] as Array<{ table: string; error: string }>,
    };

    // We run these in sequence to respect foreign key constraints
    const { suppliersData, ingredientsData, recipesData } = await populateBasicData(
      supabaseAdmin,
      results,
    );

    await populateStaff(supabaseAdmin, results);
    await populateKitchenSections(supabaseAdmin, results);

    // Core content
    if (recipesData && ingredientsData) {
      await populateDishes(supabaseAdmin, results, recipesData, ingredientsData);
    }

    // Cast recipesData to expected type for menu dishes (needs 'id' and 'name'/'recipe_name')
    // The helpers define their own interfaces but they are compatible
    if (recipesData) {
      await populateMenuDishes(supabaseAdmin, results, recipesData as any[]);
    }

    // Populate Menus (needs dishes and recipes)
    // We need to fetch the dishes we just created to pass them to populateMenus
    const { data: dishesData } = await supabaseAdmin.from('dishes').select('id, dish_name');
    if (dishesData && recipesData) {
      await populateMenus(supabaseAdmin, results, dishesData, recipesData);
    }

    // Operational data
    await populateTemperatureData(supabaseAdmin, results, 'AU');
    await populateCleaningData(supabaseAdmin, results);
    await populateComplianceData(supabaseAdmin, results);

    // Sales data needs recipes
    if (recipesData) {
      await populateSalesData(supabaseAdmin, results, recipesData as any[]);
    }

    logger.info('[Demo Mode] Data repopulated.');

    // 3. Ensure User Permissions (Business Tier + Verified)
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
