/**
 * Main populate helpers - exports all population functions
 */

import { createSupabaseAdmin } from '@/lib/supabase';

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
      const { error } = await supabaseAdmin.from(table).delete().neq('id', '0');
      if (!error) {
        cleaned++;
      }
    } catch (err) {
      // Table might not exist, continue
    }
  }
  return cleaned;
}
