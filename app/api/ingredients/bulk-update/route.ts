import { createSupabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { z } from 'zod';

const bulkUpdateIngredientsSchema = z.object({
  ids: z.array(z.string()).min(1, 'ids must be a non-empty array'),
  updates: z
    .object({
      supplier: z.string().optional(),
      storage_location: z.string().optional(),
      trim_peel_waste_percentage: z.number().min(0).max(100).optional(),
      yield_percentage: z.number().min(0).max(100).optional(),
      brand: z.string().optional(),
      pack_size: z.number().optional(),
      pack_size_unit: z.string().optional(),
      pack_price: z.number().optional(),
      unit: z.string().optional(),
      cost_per_unit: z.number().optional(),
      min_stock_level: z.number().optional(),
      current_stock: z.number().optional(),
    })
    .refine(data => Object.keys(data).length > 0, {
      message: 'updates must contain at least one field',
    }),
});
export async function PUT(request: NextRequest) {
  try {
    const supabaseAdmin = createSupabaseAdmin();

    let body: unknown;
    try {
      body = await request.json();
    } catch (err) {
      logger.warn('[Ingredients Bulk Update API] Failed to parse request body:', {
        error: err instanceof Error ? err.message : String(err),
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Invalid request body', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    const validationResult = bulkUpdateIngredientsSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          validationResult.error.issues[0]?.message || 'Invalid request body',
          'VALIDATION_ERROR',
          400,
        ),
        { status: 400 },
      );
    }

    const { ids, updates } = validationResult.data;

    // Normalize IDs
    const normalizedIds = ids.map(id => String(id).trim()).filter(Boolean);

    if (normalizedIds.length === 0) {
      return NextResponse.json(
        ApiErrorHandler.createError('No valid IDs provided', 'SERVER_ERROR', 400),
        { status: 400 },
      );
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
        // Type assertion needed because TypeScript can't narrow the type when using string index
        updateData[field] = (updates as Record<string, any>)[field];
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
      return NextResponse.json(
        ApiErrorHandler.createError('No valid fields to update', 'SERVER_ERROR', 400),
        { status: 400 },
      );
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
  } catch (e: unknown) {
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
