import { createSupabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import {
  cleanExistingData,
  populateBasicData,
  populateTemperatureData,
  populateCleaningData,
  populateComplianceData,
  populateMenuDishes,
  populateKitchenSections,
} from '@/lib/populate-helpers';

export async function POST(request: NextRequest) {
  // Prevent population in production
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      {
        error: 'Test data population is not allowed in production',
        message: 'This endpoint is only available in development mode',
      },
      { status: 403 },
    );
  }

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
    console.log('🧹 Cleaning existing test data...');
    results.cleaned = await cleanExistingData(supabaseAdmin);

    // Step 2-4: Populate basic data
    console.log('📦 Populating basic data...');
    const { recipesData } = await populateBasicData(supabaseAdmin, results);

    // Step 5-6: Populate temperature data
    console.log('🌡️ Populating temperature data...');
    await populateTemperatureData(supabaseAdmin, results, countryCode);

    // Step 7-8: Populate cleaning data
    console.log('🧽 Populating cleaning data...');
    await populateCleaningData(supabaseAdmin, results);

    // Step 9: Populate compliance data
    console.log('📋 Populating compliance data...');
    await populateComplianceData(supabaseAdmin, results);

    // Step 10: Populate menu dishes
    console.log('🍽️ Populating menu dishes...');
    await populateMenuDishes(supabaseAdmin, results, recipesData || []);

    // Step 11: Populate kitchen sections
    console.log('🍽️ Populating kitchen sections...');
    await populateKitchenSections(supabaseAdmin, results);

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
    console.error('Error during test data population:', err);
    return NextResponse.json(
      {
        error: 'Internal server error during test data population',
        details: err instanceof Error ? err.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
