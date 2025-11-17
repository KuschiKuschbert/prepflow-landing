/**
 * Main populate helpers - exports all population functions
 */

import { createSupabaseAdmin } from '@/lib/supabase';

import { logger } from '@/lib/logger';

export interface PopulateResults {
  cleaned: number;
  populated: Array<{ table: string; count: number }>;
  errors: Array<{ table: string; error: string }>;
}

export { populateBasicData } from './basic-data';
export { populateTemperatureData } from './temperature-data';
export { populateCleaningData } from './cleaning-data';
export { populateComplianceData, populateMenuDishes, populateKitchenSections } from './other-data';

/**
 * Clean up existing test data
 */
export async function cleanExistingData(
  supabaseAdmin: ReturnType<typeof createSupabaseAdmin>,
): Promise<number> {
  const tablesToClean = [
    'temperature_logs',
    'recipe_ingredients',
    'prep_list_items',
    'order_list_items',
    'compliance_records',
    'menu_dishes',
    'ingredients',
    'recipes',
    'temperature_equipment',
    'supplier_price_lists',
    'suppliers',
    'compliance_types',
    'kitchen_sections',
    'prep_lists',
    'order_lists',
    'cleaning_tasks',
    'cleaning_areas',
  ];

  let cleaned = 0;
  for (const table of tablesToClean) {
    try {
      // Delete all rows - handle both UUID and integer primary keys
      // Strategy: Try multiple filters to ensure we match all rows regardless of ID type

      // First try: UUID filter (matches all real UUIDs)
      let { error } = await supabaseAdmin
        .from(table)
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

      // If UUID filter fails with type error, try integer filter
      if (
        error &&
        (error.message?.includes('operator does not exist') ||
          error.message?.includes('invalid input syntax') ||
          error.message?.includes('uuid'))
      ) {
        logger.dev(`Table ${table} appears to use integer IDs, trying integer filter...`);
        const { error: error2 } = await supabaseAdmin.from(table).delete().gte('id', 0); // Fallback for integer IDs
        if (!error2) {
          cleaned++;
          logger.dev(`✅ Cleaned table ${table} (integer IDs)`);
        } else {
          logger.warn(`❌ Error cleaning table ${table} (both methods failed):`, error2);
        }
      } else if (!error) {
        cleaned++;
        logger.dev(`✅ Cleaned table ${table} (UUID IDs)`);
      } else {
        logger.warn(`❌ Error cleaning table ${table}:`, error);
        // Try one more fallback: delete without filter if table is empty-safe
        if (error.message?.includes('must have at least one')) {
          logger.warn(`Table ${table} requires a filter, but all filters failed. Skipping.`);
        }
      }
    } catch (err) {
      // Table might not exist, continue
      logger.warn(`⚠️ Table ${table} might not exist or error occurred, continuing...`, err);
    }
  }
  logger.dev(`🧹 Cleanup complete: ${cleaned} of ${tablesToClean.length} tables cleaned`);
  return cleaned;
}
