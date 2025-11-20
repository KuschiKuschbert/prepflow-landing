/**
 * Helper functions for populating other data (compliance, menu dishes, kitchen sections, sales data)
 */

import { logger } from '@/lib/logger';
import { cleanSampleComplianceTypes } from '@/lib/sample-compliance-clean';
import { cleanSampleKitchenSections } from '@/lib/sample-sections-clean';
import { createSupabaseAdmin } from '@/lib/supabase';
import { generateSalesDataForMonth } from './generate-sales-data';

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
  } else {
    results.populated.push({ table: 'compliance_types', count: complianceTypesData?.length || 0 });
  }
}

/**
 * Populate menu dishes
 */
export async function populateMenuDishes(
  supabaseAdmin: ReturnType<typeof createSupabaseAdmin>,
  results: PopulateResults,
  recipesData: any[],
) {
  if (!recipesData || recipesData.length === 0) return;

  const recipeMap = new Map(recipesData.map(r => [r.recipe_name || r.name, r.id]));

  const menuDishes = [
    {
      name: 'Beef Burger',
      recipe_id: recipeMap.get('Beef Burger'),
      selling_price: 18.5,
      number_sold: 45,
    },
    {
      name: 'Caesar Salad',
      recipe_id: recipeMap.get('Caesar Salad'),
      selling_price: 16.5,
      number_sold: 32,
    },
    {
      name: 'Pasta Carbonara',
      recipe_id: recipeMap.get('Pasta Carbonara'),
      selling_price: 22.5,
      number_sold: 28,
    },
    {
      name: 'Chicken Stir Fry',
      recipe_id: recipeMap.get('Chicken Stir Fry'),
      selling_price: 19.5,
      number_sold: 38,
    },
    {
      name: 'Fish and Chips',
      recipe_id: recipeMap.get('Fish and Chips'),
      selling_price: 24.5,
      number_sold: 42,
    },
    {
      name: 'Roast Chicken',
      recipe_id: recipeMap.get('Roast Chicken'),
      selling_price: 28.5,
      number_sold: 25,
    },
    {
      name: 'Vegetable Soup',
      recipe_id: recipeMap.get('Vegetable Soup'),
      selling_price: 14.5,
      number_sold: 20,
    },
    {
      name: 'Grilled Lamb Chops',
      recipe_id: recipeMap.get('Grilled Lamb Chops'),
      selling_price: 32.5,
      number_sold: 18,
    },
  ].filter(dish => dish.recipe_id);

  if (menuDishes.length > 0) {
    const { data: menuDishesData, error: menuDishesError } = await supabaseAdmin
      .from('menu_dishes')
      .insert(menuDishes)
      .select();

    if (menuDishesError) {
      results.errors.push({ table: 'menu_dishes', error: menuDishesError.message });
    } else {
      results.populated.push({ table: 'menu_dishes', count: menuDishesData?.length || 0 });
    }
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
  recipesData: any[],
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

    const { salesData, dishesCreated, dishesUsed } = await generateSalesDataForMonth(
      recipes,
      startDate,
      endDate,
      supabaseAdmin,
    );

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
      let { data, error } = await supabaseAdmin
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
