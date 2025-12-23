import { ApiErrorHandler } from '@/lib/api-error-handler';
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
import { createSupabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Get country code from query parameter (default to 'AU')
    const { searchParams } = new URL(request.url);
    const countryCode = searchParams.get('countryCode') || 'AU';

    const supabaseAdmin = createSupabaseAdmin();

    const results = {
      cleaned: 0,
      populated: [] as Array<{ table: string; count: number }>,
      errors: [] as Array<{ table: string; error: string }>,
    };

    // Step 1: Clean up existing data
    logger.dev('🧹 Cleaning existing test data...');
    results.cleaned = await cleanExistingData(supabaseAdmin);

    // Step 2-4: Populate basic data
    logger.dev('📦 Populating basic data...');
    const { recipesData, ingredientsData } = await populateBasicData(supabaseAdmin, results);

    // Step 4.5: Populate staff members
    logger.dev('👥 Populating staff members...');
    await populateStaff(supabaseAdmin, results);

    // Step 5-6: Populate temperature data
    logger.dev('🌡️ Populating temperature data...');
    await populateTemperatureData(supabaseAdmin, results, countryCode);

    // Step 7-8: Populate cleaning data
    logger.dev('🧽 Populating cleaning data...');
    await populateCleaningData(supabaseAdmin, results);

    // Step 9: Populate compliance data
    logger.dev('📋 Populating compliance data...');
    await populateComplianceData(supabaseAdmin, results);

    // Step 10: Populate dishes (new dishes system for Menu Builder & Dish Builder)
    logger.dev('🍽️ Populating dishes...');

    // Check if dishes table exists
    const { error: dishesTableError } = await supabaseAdmin.from('dishes').select('id').limit(1);
    if (dishesTableError && dishesTableError.code === '42P01') {
      results.errors.push({
        table: 'dishes',
        error: 'Dishes table does not exist. Please run menu-builder-schema.sql migration first.',
      });
      logger.error('[Populate Clean Test Data] Dishes table does not exist:', {
        error: dishesTableError.message,
        code: dishesTableError.code,
        context: { operation: 'populateDishes', table: 'dishes' },
      });
    } else if (!recipesData || recipesData.length === 0) {
      results.errors.push({
        table: 'dishes',
        error: 'Cannot create dishes: No recipes available (recipes population failed)',
      });
      logger.warn('Skipping dishes population: No recipes available');
    } else {
      await populateDishes(supabaseAdmin, results, recipesData || [], ingredientsData || []);
    }

    // Step 11: Get dishes data for menu population
    const { data: dishesData, error: dishesDataError } = await supabaseAdmin
      .from('dishes')
      .select('id, dish_name');
    if (dishesDataError) {
      logger.warn('[Populate Clean Test Data] Error fetching dishes data:', {
        error: dishesDataError.message,
        context: { operation: 'fetchDishesForMenus' },
      });
    }

    // Step 12: Populate menus and menu items
    logger.dev('📋 Populating menus...');

    // Check if menus table exists
    const { error: menusTableError } = await supabaseAdmin.from('menus').select('id').limit(1);
    if (menusTableError && menusTableError.code === '42P01') {
      results.errors.push({
        table: 'menus',
        error: 'Menus table does not exist. Please run menu-builder-schema.sql migration first.',
      });
      logger.error('[Populate Clean Test Data] Menus table does not exist:', {
        error: menusTableError.message,
        code: menusTableError.code,
        context: { operation: 'populateMenus', table: 'menus' },
      });
    } else {
      await populateMenus(supabaseAdmin, results, dishesData || [], recipesData || []);
    }

    // Step 13: Populate menu dishes (old system for Performance page compatibility)
    logger.dev('🍽️ Populating menu dishes (legacy)...');
    await populateMenuDishes(supabaseAdmin, results, recipesData || []);

    // Step 14: Populate kitchen sections
    logger.dev('🍽️ Populating kitchen sections...');
    await populateKitchenSections(supabaseAdmin, results);

    // Step 15: Populate sales data (for Performance page)
    logger.dev('📊 Populating sales data...');
    await populateSalesData(supabaseAdmin, results, recipesData || []);

    const totalPopulated = results.populated.reduce((sum, item) => sum + item.count, 0);

    return NextResponse.json({
      success: true,
      message: `Successfully populated ${totalPopulated} records across ${results.populated.length} tables`,
      summary: {
        cleaned: results.cleaned,
        populated: totalPopulated,
        tables: results.populated.length,
        errors: results.errors.length,
      },
      results: {
        populated: results.populated,
        errors: results.errors.length > 0 ? results.errors : undefined,
      },
      nextSteps: ['Visit /webapp to see all populated data'],
    });
  } catch (err) {
    logger.error('Error during test data population:', err);
    return NextResponse.json(
      ApiErrorHandler.createError(
        err instanceof Error ? err.message : 'Unknown error',
        'SERVER_ERROR',
        500,
      ),
      { status: 500 },
    );
  }
}
