import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { ApiErrorHandler } from '@/lib/api-error-handler';
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

    const { data, error } = await supabaseAdmin
      .from('cleaning_areas')
      .select('*')
      .order('area_name');

    if (error) {
      logger.error('[Cleaning Areas API] Database error fetching areas:', {
        error: error.message,
        code: (error as any).code,
        context: { endpoint: '/api/cleaning-areas', operation: 'GET', table: 'cleaning_areas' },
      });

      const apiError = ApiErrorHandler.fromSupabaseError(error, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    return NextResponse.json({
      success: true,
      data: data || [],
    });
  } catch (err) {
    logger.error('[Cleaning Areas API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/cleaning-areas', method: 'GET' },
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
    const body = await request.json();
    const { area_name, description, cleaning_frequency } = body;

    if (!area_name) {
      return NextResponse.json(
        ApiErrorHandler.createError('Area name is required', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    const { data, error } = await supabaseAdmin
      .from('cleaning_areas')
      .insert({
        area_name,
        description: description || null,
        cleaning_frequency: cleaning_frequency || 'daily',
      })
      .select()
      .single();

    if (error) {
      logger.error('[Cleaning Areas API] Database error creating area:', {
        error: error.message,
        code: (error as any).code,
        context: { endpoint: '/api/cleaning-areas', operation: 'POST', table: 'cleaning_areas' },
      });

      const apiError = ApiErrorHandler.fromSupabaseError(error, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Cleaning area created successfully',
      data,
    });
  } catch (err) {
    logger.error('[Cleaning Areas API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/cleaning-areas', method: 'POST' },
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
    const body = await request.json();
    const { id, area_name, description, cleaning_frequency, is_active } = body;

    if (!id) {
      return NextResponse.json(
        ApiErrorHandler.createError('Cleaning area ID is required', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    const updateData: any = {};
    if (area_name !== undefined) updateData.area_name = area_name;
    if (description !== undefined) updateData.description = description;
    if (cleaning_frequency !== undefined) updateData.cleaning_frequency = cleaning_frequency;
    if (is_active !== undefined) updateData.is_active = is_active;

    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    const { data, error } = await supabaseAdmin
      .from('cleaning_areas')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      logger.error('[Cleaning Areas API] Database error updating area:', {
        error: error.message,
        code: (error as any).code,
        context: { endpoint: '/api/cleaning-areas', operation: 'PUT', areaId: id },
      });

      const apiError = ApiErrorHandler.fromSupabaseError(error, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Cleaning area updated successfully',
      data,
    });
  } catch (err) {
    logger.error('[Cleaning Areas API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/cleaning-areas', method: 'PUT' },
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
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        ApiErrorHandler.createError('Cleaning area ID is required', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    const { error } = await supabaseAdmin.from('cleaning_areas').delete().eq('id', id);

    if (error) {
      logger.error('[Cleaning Areas API] Database error deleting area:', {
        error: error.message,
        code: (error as any).code,
        context: { endpoint: '/api/cleaning-areas', operation: 'DELETE', areaId: id },
      });

      const apiError = ApiErrorHandler.fromSupabaseError(error, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Cleaning area deleted successfully',
    });
  } catch (err) {
    logger.error('[Cleaning Areas API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/cleaning-areas', method: 'DELETE' },
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
