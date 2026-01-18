/**
 * Helper functions for populating other data (compliance, kitchen sections, sales data)
 */

import { logger } from '@/lib/logger';
import { cleanSampleComplianceTypes } from '@/lib/sample-compliance-clean';
import { cleanSampleKitchenSections } from '@/lib/sample-sections-clean';
import { createSupabaseAdmin } from '@/lib/supabase';
import { generateSalesDataForMonth, type Recipe } from './generate-sales-data';

interface PopulateResults {
  cleaned: number;
  populated: Array<{ table: string; count: number }>;
  errors: Array<{ table: string; error: string }>;
}

/**
 * Populate compliance types
 */
export async function populateComplianceData(
  supabaseAdmin: ReturnType<typeof createSupabaseAdmin>,
  results: PopulateResults,
) {
  const { data: complianceTypesData, error: complianceTypesError } = await supabaseAdmin
    .from('compliance_types')
    .insert(cleanSampleComplianceTypes)
    .select();

  if (complianceTypesError) {
    results.errors.push({ table: 'compliance_types', error: complianceTypesError.message });
    logger.error('Error inserting compliance_types:', complianceTypesError);
  } else {
    results.populated.push({ table: 'compliance_types', count: complianceTypesData?.length || 0 });
  }
}

/**
 * Populate kitchen sections
 */
export async function populateKitchenSections(
  supabaseAdmin: ReturnType<typeof createSupabaseAdmin>,
  results: PopulateResults,
) {
  const { data: sectionsData, error: sectionsError } = await supabaseAdmin
    .from('kitchen_sections')
    .insert(cleanSampleKitchenSections)
    .select();

  if (sectionsError) {
    results.errors.push({ table: 'kitchen_sections', error: sectionsError.message });
    logger.error('Error inserting kitchen_sections:', sectionsError);
  } else {
    results.populated.push({ table: 'kitchen_sections', count: sectionsData?.length || 0 });
  }
}

/**
 * Populate sales data for menu dishes (last 30 days)
 */
export async function populateSalesData(
  supabaseAdmin: ReturnType<typeof createSupabaseAdmin>,
  results: PopulateResults,
  recipesData: Recipe[],
) {
  if (!recipesData || recipesData.length === 0) {
    logger.dev('No recipes available for sales data generation');
    return;
  }

  try {
    // Generate sales data for the last 30 days
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999); // End of today
    const startDate = new Date(endDate.getTime() - 29 * 24 * 60 * 60 * 1000); // 30 days ago
    startDate.setHours(0, 0, 0, 0); // Start of day

    logger.dev(
      `📊 Generating sales data for ${recipesData.length} recipes from ${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}...`,
    );

    // Convert recipes to format expected by generateSalesDataForMonth
    const recipes = recipesData.map(r => ({
      id: r.id,
      recipe_name: r.recipe_name || r.name,
      name: r.name || r.recipe_name,
    }));

    const {
      salesData,
      dishesCreated: _dishesCreated,
      dishesUsed: _dishesUsed,
    } = await generateSalesDataForMonth(recipes, startDate, endDate, supabaseAdmin);

    if (salesData.length === 0) {
      logger.warn('No sales data generated');
      return;
    }

    // Batch insert sales data
    const BATCH_SIZE = 500;
    let insertedCount = 0;

    for (let i = 0; i < salesData.length; i += BATCH_SIZE) {
      const batch = salesData.slice(i, i + BATCH_SIZE);

      // Try upsert first, fallback to insert if constraint doesn't exist
      const { data, error } = await supabaseAdmin
        .from('sales_data')
        .upsert(batch, {
          onConflict: 'dish_id,date',
          ignoreDuplicates: false,
        })
        .select();

      // If upsert fails due to missing constraint, try insert
      if (error && error.message.includes('no unique or exclusion constraint')) {
        // Insert one by one, skipping duplicates
        for (const record of batch) {
          const { error: singleError } = await supabaseAdmin.from('sales_data').insert(record);

          if (!singleError) {
            insertedCount++;
          } else if (!singleError.message.includes('duplicate')) {
            logger.warn(`Error inserting sales record: ${singleError.message}`);
          }
        }
      } else if (error) {
        results.errors.push({ table: 'sales_data', error: error.message });
        logger.error(`Error inserting sales data batch:`, error);
      } else {
        insertedCount += data?.length || 0;
      }
    }

    if (insertedCount > 0) {
      results.populated.push({ table: 'sales_data', count: insertedCount });
      logger.dev(`✅ Inserted ${insertedCount} sales data records`);
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    results.errors.push({ table: 'sales_data', error: errorMessage });
    logger.error('Error populating sales data:', err);
  }
}
