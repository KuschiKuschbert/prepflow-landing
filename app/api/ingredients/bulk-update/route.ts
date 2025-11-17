import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdmin } from '@/lib/supabase';

import { logger } from '@/lib/logger';
export async function PUT(request: NextRequest) {
  try {
    const supabaseAdmin = createSupabaseAdmin();

    const body = await request.json();
    const { ids, updates } = body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'ids must be a non-empty array' }, { status: 400 });
    }

    if (!updates || typeof updates !== 'object') {
      return NextResponse.json({ error: 'updates must be an object' }, { status: 400 });
    }

    // Normalize IDs
    const normalizedIds = ids.map(id => String(id).trim()).filter(Boolean);

    if (normalizedIds.length === 0) {
      return NextResponse.json({ error: 'No valid IDs provided' }, { status: 400 });
    }

    // Prepare update data - only include valid fields
    const validFields = [
      'supplier',
      'storage_location',
      'trim_peel_waste_percentage',
      'yield_percentage',
      'brand',
      'pack_size',
      'pack_size_unit',
      'pack_price',
      'unit',
      'cost_per_unit',
      'min_stock_level',
      'current_stock',
    ];

    const updateData: Record<string, any> = {};
    for (const field of validFields) {
      if (field in updates) {
        updateData[field] = updates[field];
      }
    }

    // If updating wastage, also update yield percentage
    if (
      'trim_peel_waste_percentage' in updates &&
      typeof updates.trim_peel_waste_percentage === 'number'
    ) {
      updateData.yield_percentage = 100 - updates.trim_peel_waste_percentage;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    // Add updated_at timestamp
    updateData.updated_at = new Date().toISOString();

    // Perform bulk update
    const { data, error } = await supabaseAdmin
      .from('ingredients')
      .update(updateData)
      .in('id', normalizedIds)
      .select();

    if (error) {
      logger.error('[bulk-update] Error updating ingredients:', error);
      return NextResponse.json(
        {
          error: 'Failed to update ingredients',
          details: error.message,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: `Successfully updated ${data?.length || 0} ingredient${data?.length !== 1 ? 's' : ''}`,
      data: {
        updated: data?.length || 0,
        ids: normalizedIds,
      },
    });
  } catch (e: any) {
    logger.error('[bulk-update] Unexpected error:', e);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: e instanceof Error ? e.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
