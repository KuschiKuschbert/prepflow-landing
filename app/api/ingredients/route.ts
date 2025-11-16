import { normalizeIngredientData } from '@/lib/ingredients/normalizeIngredientDataMain';
import { createSupabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest) {
  try {
    const supabaseAdmin = createSupabaseAdmin();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');

    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;

    const { data, error, count } = await supabaseAdmin
      .from('ingredients')
      .select('*', { count: 'exact' })
      .order('ingredient_name')
      .range(start, end);

    if (error) {
      logger.error('[Ingredients API] Database error fetching ingredients:', {
        error: error.message,
        code: (error as any).code,
        context: { endpoint: '/api/ingredients', operation: 'GET', table: 'ingredients' },
      });

      const apiError = ApiErrorHandler.fromSupabaseError(error, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    return NextResponse.json({
      success: true,
      data: {
        items: data || [],
        total: count || 0,
        page,
        pageSize,
        totalPages: Math.ceil((count || 0) / pageSize),
      },
    });
  } catch (err) {
    logger.error('[Ingredients API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/ingredients', method: 'GET' },
    });

    return NextResponse.json(
      ApiErrorHandler.createError(
        process.env.NODE_ENV === 'development'
          ? err instanceof Error
            ? err.message
            : 'Unknown error'
          : 'Internal server error',
        'SERVER_ERROR',
        500,
      ),
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabaseAdmin = createSupabaseAdmin();
    const body = await request.json();

    // Normalize ingredient data
    const { normalized, error: normalizeError } = normalizeIngredientData(body);
    if (normalizeError) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          'Failed to normalize ingredient data',
          'VALIDATION_ERROR',
          400,
          {
            details: normalizeError,
          },
        ),
        { status: 400 },
      );
    }

    // Insert using admin client (bypasses RLS)
    const { data, error } = await supabaseAdmin.from('ingredients').insert([normalized]).select();

    if (error) {
      logger.error('[Ingredients API] Database error inserting ingredient:', {
        error: error.message,
        code: (error as any).code,
        context: { endpoint: '/api/ingredients', operation: 'POST', table: 'ingredients' },
      });

      const apiError = ApiErrorHandler.fromSupabaseError(error, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    return NextResponse.json({
      success: true,
      data: data?.[0] || null,
    });
  } catch (err) {
    logger.error('[Ingredients API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/ingredients', method: 'POST' },
    });

    return NextResponse.json(
      ApiErrorHandler.createError(
        process.env.NODE_ENV === 'development'
          ? err instanceof Error
            ? err.message
            : 'Unknown error'
          : 'Internal server error',
        'SERVER_ERROR',
        500,
      ),
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabaseAdmin = createSupabaseAdmin();
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        ApiErrorHandler.createError('Ingredient ID is required', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    // Format text fields
    const formattedUpdates: any = {
      ...updates,
      updated_at: new Date().toISOString(),
    };

    if (updates.ingredient_name) {
      const { formatIngredientName } = await import('@/lib/text-utils');
      formattedUpdates.ingredient_name = formatIngredientName(updates.ingredient_name);
    }
    if (updates.brand) {
      const { formatBrandName } = await import('@/lib/text-utils');
      formattedUpdates.brand = formatBrandName(updates.brand);
    }
    if (updates.supplier) {
      const { formatSupplierName } = await import('@/lib/text-utils');
      formattedUpdates.supplier = formatSupplierName(updates.supplier);
    }
    if (updates.storage_location) {
      const { formatStorageLocation } = await import('@/lib/text-utils');
      formattedUpdates.storage_location = formatStorageLocation(updates.storage_location);
    }
    if (updates.product_code) {
      const { formatTextInput } = await import('@/lib/text-utils');
      formattedUpdates.product_code = formatTextInput(updates.product_code);
    }

    // Update using admin client (bypasses RLS)
    const { data, error } = await supabaseAdmin
      .from('ingredients')
      .update(formattedUpdates)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) {
      logger.error('[Ingredients API] Database error updating ingredient:', {
        error: error.message,
        code: (error as any).code,
        context: { endpoint: '/api/ingredients', operation: 'PUT', ingredientId: id },
      });

      const apiError = ApiErrorHandler.fromSupabaseError(error, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    if (!data) {
      return NextResponse.json(
        ApiErrorHandler.createError('Ingredient not found', 'NOT_FOUND', 404, {
          ingredientId: id,
        }),
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: data,
    });
  } catch (err) {
    logger.error('[Ingredients API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/ingredients', method: 'PUT' },
    });

    return NextResponse.json(
      ApiErrorHandler.createError(
        process.env.NODE_ENV === 'development'
          ? err instanceof Error
            ? err.message
            : 'Unknown error'
          : 'Internal server error',
        'SERVER_ERROR',
        500,
      ),
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabaseAdmin = createSupabaseAdmin();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        ApiErrorHandler.createError('Ingredient ID is required', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    // Delete using admin client (bypasses RLS)
    const { error } = await supabaseAdmin.from('ingredients').delete().eq('id', id);

    if (error) {
      logger.error('[Ingredients API] Database error deleting ingredient:', {
        error: error.message,
        code: (error as any).code,
        context: { endpoint: '/api/ingredients', operation: 'DELETE', ingredientId: id },
      });

      const apiError = ApiErrorHandler.fromSupabaseError(error, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Ingredient deleted successfully',
    });
  } catch (err) {
    logger.error('[Ingredients API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/ingredients', method: 'DELETE' },
    });

    return NextResponse.json(
      ApiErrorHandler.createError(
        process.env.NODE_ENV === 'development'
          ? err instanceof Error
            ? err.message
            : 'Unknown error'
          : 'Internal server error',
        'SERVER_ERROR',
        500,
      ),
      { status: 500 },
    );
  }
}
