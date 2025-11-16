import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { createCleaningArea } from './helpers/createCleaningArea';
import { deleteCleaningArea } from './helpers/deleteCleaningArea';
import { handleCleaningAreaError } from './helpers/handleCleaningAreaError';
import { updateCleaningArea } from './helpers/updateCleaningArea';

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
    return handleCleaningAreaError(err, 'GET');
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

    const data = await createCleaningArea({
      area_name,
      description,
      cleaning_frequency,
    });

    return NextResponse.json({
      success: true,
      message: 'Cleaning area created successfully',
      data,
    });
  } catch (err: any) {
    if (err.status) {
      return NextResponse.json(err, { status: err.status });
    }
    return handleCleaningAreaError(err, 'POST');
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

    const data = await updateCleaningArea(id, updateData);

    return NextResponse.json({
      success: true,
      message: 'Cleaning area updated successfully',
      data,
    });
  } catch (err: any) {
    if (err.status) {
      return NextResponse.json(err, { status: err.status });
    }
    return handleCleaningAreaError(err, 'PUT');
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

    await deleteCleaningArea(id);

    return NextResponse.json({
      success: true,
      message: 'Cleaning area deleted successfully',
    });
  } catch (err: any) {
    if (err.status) {
      return NextResponse.json(err, { status: err.status });
    }
    return handleCleaningAreaError(err, 'DELETE');
  }
}
