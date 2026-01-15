import { cleanSampleConsumablesIngredients } from '@/data/sample-ingredients-consumables';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { createSupabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/ingredients/add-consumables
 * Safely adds consumables ingredients without deleting any existing data.
 * This endpoint only performs INSERT operations - it never deletes or modifies existing data.
 *
 * @returns {Promise<NextResponse>} Response with count of items added
 */
export async function POST(request: NextRequest) {
  try {
    const supabaseAdmin = createSupabaseAdmin();

    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Unable to connect to database', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    logger.dev('Starting safe consumables addition...');

    // Step 1: Ensure "Restaurant Supplies Co" supplier exists (add if missing, don't delete existing)
    const supplierName = 'Restaurant Supplies Co';
    const { data: existingSuppliers, error: suppliersError } = await supabaseAdmin
      .from('suppliers')
      .select('id, supplier_name')
      .eq('supplier_name', supplierName)
      .maybeSingle();

    if (suppliersError && suppliersError.code !== 'PGRST116') {
      logger.warn('[Add Consumables] Error checking for existing supplier:', {
        error: suppliersError.message,
        code: (suppliersError as any).code,
      });
    }

    let supplierId: string | null = null;

    if (!existingSuppliers) {
      // Supplier doesn't exist, add it
      const { data: newSupplier, error: supplierError } = await supabaseAdmin
        .from('suppliers')
        .insert({
          supplier_name: supplierName,
          contact_person: 'Patricia Supplies',
          email: 'patricia@restaurantsupplies.com',
          phone: '0426 789 012',
          address: '468 Packaging Way, Brisbane QLD 4000',
        })
        .select('id')
        .single();

      if (supplierError) {
        logger.warn('Failed to add supplier, continuing with consumables', {
          error: supplierError.message,
        });
      } else {
        supplierId = newSupplier?.id || null;
        logger.dev(`✅ Added supplier: ${supplierName}`);
      }
    } else {
      supplierId = existingSuppliers.id;
      logger.dev(`✅ Supplier already exists: ${supplierName}`);
    }

    // Step 2: Check for existing ingredients by name (case-insensitive)
    const { data: existingIngredients, error: ingredientsError } = await supabaseAdmin
      .from('ingredients')
      .select('ingredient_name');

    if (ingredientsError) {
      logger.warn('[Add Consumables] Error fetching existing ingredients:', {
        error: ingredientsError.message,
        code: (ingredientsError as any).code,
      });
      // Continue with empty array if fetch fails
    }

    const existingIngredientNames = new Set(
      (existingIngredients || []).map(i => i.ingredient_name?.toLowerCase().trim()).filter(Boolean),
    );

    // Step 3: Filter out consumables that already exist
    const consumablesToInsert = cleanSampleConsumablesIngredients.filter(
      i => !existingIngredientNames.has(i.ingredient_name?.toLowerCase().trim()),
    );

    if (consumablesToInsert.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'All consumables already exist in the database',
        summary: {
          added: 0,
          skipped: cleanSampleConsumablesIngredients.length,
          total: cleanSampleConsumablesIngredients.length,
        },
      });
    }

    // Step 4: Insert only new consumables
    const { data: insertedConsumables, error: insertError } = await supabaseAdmin
      .from('ingredients')
      .insert(consumablesToInsert)
      .select();

    if (insertError) {
      logger.error('Error inserting consumables:', insertError);
      const apiError = ApiErrorHandler.fromSupabaseError(insertError, 500);
      apiError.details = {
        ...(typeof apiError.details === 'object' && apiError.details !== null ? apiError.details : {}),
        message: 'Failed to add consumables',
        note: 'Some consumables may have been added before the error occurred',
      };
      return NextResponse.json(apiError, { status: 500 });
    }

    const addedCount = insertedConsumables?.length || 0;
    const skippedCount = cleanSampleConsumablesIngredients.length - addedCount;

    logger.dev(
      `✅ Successfully added ${addedCount} consumables, skipped ${skippedCount} duplicates`,
    );

    return NextResponse.json({
      success: true,
      message: `Successfully added ${addedCount} consumable${addedCount !== 1 ? 's' : ''}`,
      summary: {
        added: addedCount,
        skipped: skippedCount,
        total: cleanSampleConsumablesIngredients.length,
      },
      items: insertedConsumables?.map(i => i.ingredient_name) || [],
    });
  } catch (err) {
    logger.error('Unexpected error adding consumables:', err);
    return NextResponse.json(
      ApiErrorHandler.createError(
        err instanceof Error ? err.message : 'Unknown error',
        'SERVER_ERROR',
        500,
      ),
      { status: 500 },
    );
  }
}
