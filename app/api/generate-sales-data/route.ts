import { createSupabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { generateSalesDataForMonth } from '@/lib/populate-helpers/generate-sales-data';

import { logger } from '@/lib/logger';
export async function POST(request: NextRequest) {
  try {
    logger.dev('🚀 POST /api/generate-sales-data - Starting...');
    const supabaseAdmin = createSupabaseAdmin();

    if (!supabaseAdmin) {
      logger.error('❌ Database connection not available');
      return NextResponse.json(
        {
          error: 'Database connection not available',
        },
        { status: 500 },
      );
    }

    // Get optional query parameters
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');
    const startDateParam = searchParams.get('startDate');

    // Calculate date range (past 30 days by default)
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999); // End of today

    const startDate = startDateParam
      ? new Date(startDateParam)
      : new Date(endDate.getTime() - (days - 1) * 24 * 60 * 60 * 1000);
    startDate.setHours(0, 0, 0, 0); // Start of day

    logger.dev(
      `📅 Date range: ${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}`,
    );

    // Fetch all recipes
    logger.dev('📖 Fetching recipes...');
    const { data: recipes, error: recipesError } = await supabaseAdmin
      .from('recipes')
      .select('id, recipe_name')
      .order('recipe_name');

    if (recipesError) {
      logger.error('❌ Error fetching recipes:', recipesError);
      return NextResponse.json(
        {
          error: 'Database error',
          message: 'Could not retrieve recipes from database',
          details: recipesError,
        },
        { status: 500 },
      );
    }

    logger.dev(`✅ Found ${recipes?.length || 0} recipes`);

    if (!recipes || recipes.length === 0) {
      logger.warn('⚠️ No recipes found');
      return NextResponse.json(
        {
          error: 'No recipes found',
          message: 'Please create recipes before generating sales data',
        },
        { status: 400 },
      );
    }

    // Generate sales data
    logger.dev(`📊 Generating sales data for ${recipes.length} recipes over ${days} days...`);
    const { salesData, dishesCreated, dishesUsed } = await generateSalesDataForMonth(
      recipes,
      startDate,
      endDate,
      supabaseAdmin,
    );

    logger.dev(
      `✅ Generated ${salesData.length} sales data entries, created ${dishesCreated} dishes, used ${dishesUsed} existing dishes`,
    );

    if (salesData.length === 0) {
      logger.error('❌ No sales data generated');
      return NextResponse.json(
        {
          error: 'No sales data generated',
          message: 'Failed to generate sales data. Please check that menu_dishes can be created.',
        },
        { status: 500 },
      );
    }

    // Batch insert sales data (Supabase has a limit, so we'll do it in chunks)
    const BATCH_SIZE = 500;
    let insertedCount = 0;
    const errors: Array<{ batch: number; error: string }> = [];

    logger.dev(`💾 Inserting ${salesData.length} sales records in batches of ${BATCH_SIZE}...`);

    for (let i = 0; i < salesData.length; i += BATCH_SIZE) {
      const batch = salesData.slice(i, i + BATCH_SIZE);
      const batchNumber = Math.floor(i / BATCH_SIZE) + 1;

      logger.dev(
        `📦 Inserting batch ${batchNumber}/${Math.ceil(salesData.length / BATCH_SIZE)} (${batch.length} records)...`,
      );

      // Use insert with ignoreDuplicates instead of upsert if unique constraint doesn't exist
      // First try upsert, if it fails, try insert with ignoreDuplicates
      let { data, error } = await supabaseAdmin
        .from('sales_data')
        .upsert(batch, {
          onConflict: 'dish_id,date',
          ignoreDuplicates: false,
        })
        .select();

      // If upsert fails due to missing constraint, try insert with ignoreDuplicates
      if (error && error.message.includes('no unique or exclusion constraint')) {
        logger.warn(
          `⚠️ Unique constraint missing, using insert with ignoreDuplicates for batch ${batchNumber}`,
        );
        // Insert one by one, skipping duplicates
        const inserted: any[] = [];
        for (const record of batch) {
          const { data: singleData, error: singleError } = await supabaseAdmin
            .from('sales_data')
            .insert(record)
            .select();

          if (!singleError && singleData) {
            inserted.push(...singleData);
          } else if (singleError && !singleError.message.includes('duplicate')) {
            logger.error(`Error inserting record:`, singleError);
          }
        }
        data = inserted;
        error = null;
      }

      if (error) {
        logger.error(`❌ Error inserting batch ${batchNumber}:`, error);
        errors.push({ batch: batchNumber, error: error.message });
      } else {
        insertedCount += data?.length || 0;
        logger.dev(`✅ Batch ${batchNumber} inserted: ${data?.length || 0} records`);
      }
    }

    logger.dev(`✅ Total inserted: ${insertedCount} records, ${errors.length} errors`);

    const totalDays =
      Math.ceil((endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000)) + 1;

    return NextResponse.json({
      success: true,
      message: `Successfully generated sales data for ${recipes.length} recipes over ${totalDays} days`,
      summary: {
        recipesProcessed: recipes.length,
        dishesCreated: dishesCreated,
        dishesUsed: dishesUsed,
        daysGenerated: totalDays,
        salesRecordsCreated: insertedCount,
        batchesProcessed: Math.ceil(salesData.length / BATCH_SIZE),
        errors: errors.length,
      },
      dateRange: {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
      },
      errors: errors.length > 0 ? errors : undefined,
      nextSteps: ['Visit /webapp/performance to view the generated sales data'],
    });
  } catch (error) {
    logger.error('Error generating sales data:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'An unexpected error occurred while generating sales data',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
