import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

import { logger } from '../../lib/logger';
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { dishId, sectionId } = body;

    if (!dishId) {
      return NextResponse.json(
        {
          error: 'Missing required fields',
          message: 'Dish ID is required',
        },
        { status: 400 },
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        {
          error: 'Database connection not available',
        },
        { status: 500 },
      );
    }

    const { data, error } = await supabaseAdmin
      .from('menu_dishes')
      .update({
        kitchen_section_id: sectionId || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', dishId)
      .select(
        `
        id,
        name,
        kitchen_section_id,
        kitchen_sections (
          id,
          name,
          color
        )
      `,
      )
      .single();

    if (error) {
      logger.error('Error assigning dish to section:', error);
      return NextResponse.json(
        {
          error: 'Failed to assign dish to section',
          message: 'Could not update dish section assignment',
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Dish section assignment updated successfully',
      data,
    });
  } catch (error) {
    logger.error('Assign dish section API error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'An unexpected error occurred',
      },
      { status: 500 },
    );
  }
}
