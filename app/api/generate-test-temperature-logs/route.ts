import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { generateLegacyTemperatureLogs } from '@/lib/generate-legacy-temperature-logs';

import { logger } from '../../lib/logger';
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

    logger.dev('🌡️ Starting temperature log generation...');

    // First, check if equipment exists
    let { data: equipment, error: equipmentError } = await supabaseAdmin
      .from('temperature_equipment')
      .select('*')
      .eq('is_active', true);

    if (equipmentError) {
      logger.error('Error fetching equipment:', equipmentError);
      return NextResponse.json(
        {
          error: 'Failed to fetch equipment',
          message: equipmentError.message,
        },
        { status: 500 },
      );
    }

    // If no equipment exists, create 5 sample equipment items
    if (!equipment || equipment.length === 0) {
      logger.dev('No equipment found. Creating 5 sample equipment items...');
      const sampleEquipment = [
        {
          name: 'Main Refrigerator',
          equipment_type: 'Cold Storage',
          location: 'Kitchen',
          min_temp_celsius: 0,
          max_temp_celsius: 5,
          is_active: true,
        },
        {
          name: 'Walk-in Freezer',
          equipment_type: 'Freezer',
          location: 'Storage Room',
          min_temp_celsius: -24,
          max_temp_celsius: -18,
          is_active: true,
        },
        {
          name: 'Hot Holding Cabinet',
          equipment_type: 'Hot Holding',
          location: 'Service Area',
          min_temp_celsius: 60,
          max_temp_celsius: 75,
          is_active: true,
        },
        {
          name: 'Display Fridge',
          equipment_type: 'Cold Storage',
          location: 'Service Area',
          min_temp_celsius: 0,
          max_temp_celsius: 5,
          is_active: true,
        },
        {
          name: 'Ice Machine',
          equipment_type: 'Ice Production',
          location: 'Bar Area',
          min_temp_celsius: -2,
          max_temp_celsius: 0,
          is_active: true,
        },
      ];

      const { data: insertedEquipment, error: insertError } = await supabaseAdmin
        .from('temperature_equipment')
        .insert(sampleEquipment)
        .select();

      if (insertError) {
        logger.error('Error creating sample equipment:', insertError);
        return NextResponse.json(
          {
            error: 'Failed to create sample equipment',
            message: insertError.message,
          },
          { status: 500 },
        );
      }

      logger.dev(`✅ Created ${insertedEquipment.length} sample equipment items`);
      equipment = insertedEquipment;
    }

    logger.dev(`📊 Found ${equipment.length} active equipment items`);

    // Generate data for the last 3 months
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 3);

    const temperatureLogs = generateLegacyTemperatureLogs(equipment, startDate, endDate);
    logger.dev(`📝 Generated ${temperatureLogs.length} temperature log entries`);

    // Insert logs in batches to avoid overwhelming the database
    const batchSize = 100;
    let insertedCount = 0;

    for (let i = 0; i < temperatureLogs.length; i += batchSize) {
      const batch = temperatureLogs.slice(i, i + batchSize);

      const { error: insertError } = await supabaseAdmin.from('temperature_logs').insert(batch);

      if (insertError) {
        logger.error('Error inserting batch:', insertError);
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
      logger.dev(
        `✅ Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(temperatureLogs.length / batchSize)} (${insertedCount}/${temperatureLogs.length} logs)`,
      );
    }

    logger.dev(`🎉 Successfully generated ${insertedCount} temperature log entries`);

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
    logger.error('Error generating temperature logs:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate temperature logs',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
