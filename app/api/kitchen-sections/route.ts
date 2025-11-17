import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

import { logger } from '@/lib/logger';
export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        {
          error: 'Database connection not available',
        },
        { status: 500 },
      );
    }

    // Fetch kitchen sections - try different column name variations
    let query = supabaseAdmin
      .from('kitchen_sections')
      .select('id, name, section_name, color_code, color')
      .order('name', { ascending: true });

    // Try to filter by is_active if column exists
    let { data, error } = await query.eq('is_active', true);

    if (error) {
      // If is_active column doesn't exist, try without filter
      const fallbackQuery = supabaseAdmin
        .from('kitchen_sections')
        .select('id, name, section_name, color_code, color')
        .order('name', { ascending: true });

      const result = await fallbackQuery;
      data = result.data;
      error = result.error;

      if (error) {
        logger.error('Error fetching kitchen sections:', error);
        return NextResponse.json(
          {
            error: 'Failed to fetch kitchen sections',
            message: 'Could not retrieve kitchen section data',
            details: error.message,
          },
          { status: 500 },
        );
      }
    }

    // Map data to normalize column names
    const mappedData = (data || []).map((section: any) => ({
      id: section.id,
      name: section.name || section.section_name,
      color: section.color || section.color_code || '#29E7CD',
    }));

    return NextResponse.json({
      success: true,
      data: mappedData,
    });
  } catch (error) {
    logger.error('Kitchen sections API error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'An unexpected error occurred',
      },
      { status: 500 },
    );
  }
}
