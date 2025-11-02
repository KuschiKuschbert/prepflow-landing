import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { generateLegacyTemperatureLogs } from '@/lib/generate-legacy-temperature-logs';

/**
 * @deprecated This endpoint is deprecated. Temperature logs are now automatically
 * generated as part of the populate-clean-test-data endpoint with regional standards.
 * Use /api/populate-clean-test-data?countryCode=XX instead.
 */
export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        {
          error: 'Database connection not available',
        },
        { status: 500 },
      );
    }

    console.log('🌡️ Starting temperature log generation...');

    // First, get all active equipment
    const { data: equipment, error: equipmentError } = await supabaseAdmin
      .from('temperature_equipment')
      .select('*')
      .eq('is_active', true);

    if (equipmentError) {
      console.error('Error fetching equipment:', equipmentError);
      return NextResponse.json(
        {
          error: 'Failed to fetch equipment',
          message: equipmentError.message,
        },
        { status: 500 },
      );
    }

    if (!equipment || equipment.length === 0) {
      return NextResponse.json(
        {
          error: 'No active equipment found',
          message: 'Please add some temperature equipment first in the setup page',
        },
        { status: 400 },
      );
    }

    console.log(`📊 Found ${equipment.length} active equipment items`);

    // Generate data for the last 3 months
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 3);

    const temperatureLogs = generateLegacyTemperatureLogs(equipment, startDate, endDate);
    console.log(`📝 Generated ${temperatureLogs.length} temperature log entries`);

    // Insert logs in batches to avoid overwhelming the database
    const batchSize = 100;
    let insertedCount = 0;

    for (let i = 0; i < temperatureLogs.length; i += batchSize) {
      const batch = temperatureLogs.slice(i, i + batchSize);

      const { error: insertError } = await supabaseAdmin.from('temperature_logs').insert(batch);

      if (insertError) {
        console.error('Error inserting batch:', insertError);
        return NextResponse.json(
          {
            error: 'Failed to insert temperature logs',
            message: insertError.message,
            insertedCount,
          },
          { status: 500 },
        );
      }

      insertedCount += batch.length;
      console.log(
        `✅ Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(temperatureLogs.length / batchSize)} (${insertedCount}/${temperatureLogs.length} logs)`,
      );
    }

    console.log(`🎉 Successfully generated ${insertedCount} temperature log entries`);

    return NextResponse.json({
      success: true,
      message: `Successfully generated ${insertedCount} temperature log entries for the last 3 months`,
      data: {
        totalLogs: insertedCount,
        equipmentCount: equipment.length,
        dateRange: {
          start: startDate.toISOString().split('T')[0],
          end: endDate.toISOString().split('T')[0],
        },
        breakdown: {
          equipmentLogs:
            equipment.length *
            2 *
            Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)),
          hotHoldingLogs:
            2 * Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)),
          coldHoldingLogs:
            2 * Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)),
          cookingLogs:
            1 * Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)),
        },
      },
    });
  } catch (error) {
    console.error('Error generating temperature logs:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate temperature logs',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
