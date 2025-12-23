import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

import { logger } from '@/lib/logger';
import { ApiErrorHandler } from '@/lib/api-error-handler';
/**
 * Generate 5 sample temperature log entries for each active equipment
 * Spreads entries randomly across the last 2 weeks (14 days) for better analytics visualization
 */
export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    logger.dev('🌡️ Generating 5 sample temperature logs per equipment...');

    // Fetch all active equipment
    const { data: equipment, error: equipmentError } = await supabaseAdmin
      .from('temperature_equipment')
      .select('*')
      .eq('is_active', true);

    if (equipmentError) {
      logger.error('Error fetching equipment:', equipmentError);
      return NextResponse.json(
        ApiErrorHandler.fromSupabaseError(equipmentError, 500),
        { status: 500 },
      );
    }

    if (!equipment || equipment.length === 0) {
      return NextResponse.json(
        ApiErrorHandler.createError('Please create temperature equipment first', 'NO_EQUIPMENT_FOUND', 400),
        { status: 400 },
      );
    }

    logger.dev(`📊 Found ${equipment.length} active equipment items`);

    // Generate 5 entries per equipment, randomly spread across the last 2 weeks (14 days)
    const logs: any[] = [];
    const today = new Date();

    equipment.forEach(eq => {
      // Generate 5 entries randomly spread across last 2 weeks (14 days)
      for (let i = 0; i < 5; i++) {
        // Random days ago between 0 and 13 (last 2 weeks)
        const daysAgo = Math.floor(Math.random() * 14);
        const logDate = new Date(today);
        logDate.setDate(logDate.getDate() - daysAgo);

        // Generate random time throughout the day (24 hours)
        const hours = Math.floor(Math.random() * 24); // 0 to 23
        const minutes = Math.floor(Math.random() * 60);

        // Generate temperature based on equipment type and thresholds
        let temperature: number;
        if (eq.min_temp_celsius !== null && eq.max_temp_celsius !== null) {
          // Generate temperature within range (with occasional out-of-range for realism)
          const isOutOfRange = Math.random() < 0.1; // 10% chance of out-of-range
          if (isOutOfRange) {
            // Generate slightly out of range
            const range = eq.max_temp_celsius - eq.min_temp_celsius;
            if (Math.random() < 0.5) {
              // Below minimum
              temperature = eq.min_temp_celsius - Math.random() * (range * 0.2);
            } else {
              // Above maximum
              temperature = eq.max_temp_celsius + Math.random() * (range * 0.2);
            }
          } else {
            // Within range
            temperature =
              eq.min_temp_celsius + Math.random() * (eq.max_temp_celsius - eq.min_temp_celsius);
          }
        } else {
          // Default temperatures based on equipment type
          const type = eq.equipment_type?.toLowerCase() || '';
          if (type.includes('freezer')) {
            temperature = -20 + Math.random() * 4; // -20 to -16
          } else if (type.includes('hot') || type.includes('warming')) {
            temperature = 60 + Math.random() * 15; // 60 to 75
          } else {
            temperature = 2 + Math.random() * 3; // 2 to 5 (fridge range)
          }
        }

        // Round to 1 decimal place
        temperature = Math.round(temperature * 10) / 10;

        logs.push({
          log_date: logDate.toISOString().split('T')[0],
          log_time: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`,
          temperature_type: eq.equipment_type || 'Cold Storage',
          temperature_celsius: temperature,
          location: eq.location || eq.name, // Link to equipment by location/name
          notes: i === 0 ? 'Sample log entry' : null, // Add note to first entry
          logged_by: 'System',
          // Note: equipment_id field doesn't exist in temperature_logs schema
          // Equipment is linked via location field matching equipment name
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }
    });

    logger.dev(`📝 Generated ${logs.length} temperature log entries`);

    // Insert logs in a single batch
    const { error: insertError } = await supabaseAdmin.from('temperature_logs').insert(logs);

    if (insertError) {
      logger.error('Error inserting logs:', insertError);
      return NextResponse.json(
        {
          error: 'Failed to insert temperature logs',
          message: insertError.message,
        },
        { status: 500 },
      );
    }

    logger.dev(`🎉 Successfully generated ${logs.length} temperature log entries`);

    return NextResponse.json({
      success: true,
      message: `Successfully generated ${logs.length} temperature log entries (5 per equipment)`,
      data: {
        totalLogs: logs.length,
        equipmentCount: equipment.length,
        logsPerEquipment: 5,
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
