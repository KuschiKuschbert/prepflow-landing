import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
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

export type BulkUpdateIngredientsData = z.infer<typeof bulkUpdateIngredientsSchema>;

export async function parseBulkUpdateBody(
  request: NextRequest,
): Promise<BulkUpdateIngredientsData | NextResponse> {
  let body: unknown;
  try {
    body = await request.json();
  } catch (err) {
    logger.warn('[Ingredients Bulk Update API] Failed to parse request JSON:', {
      error: err instanceof Error ? err.message : String(err),
    });
    return NextResponse.json(
      ApiErrorHandler.createError('Invalid JSON body', 'VALIDATION_ERROR', 400),
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

  return validationResult.data;
}

export function prepareIngredientUpdateData(
  ids: string[],
  updates: Record<string, unknown>,
): { normalizedIds: string[]; updateData: Record<string, unknown> } | string {
  // Normalize IDs
  const normalizedIds = ids.map(id => String(id).trim()).filter(Boolean);

  if (normalizedIds.length === 0) {
    return 'No valid IDs provided';
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

  const updateData: Record<string, unknown> = {};
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
    return 'No valid fields to update';
  }

  updateData.updated_at = new Date().toISOString();

  return { normalizedIds, updateData };
}
