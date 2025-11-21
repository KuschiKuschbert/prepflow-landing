import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { createSupabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { createIngredient } from './helpers/createIngredient';
import { deleteIngredient } from './helpers/deleteIngredient';
import { handleIngredientError } from './helpers/handleIngredientError';
import { updateIngredient } from './helpers/updateIngredient';

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
    return handleIngredientError(err, 'GET');
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = await createIngredient(body);

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (err: any) {
    if (err.status) {
      return NextResponse.json(err, { status: err.status });
    }
    return handleIngredientError(err, 'POST');
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        ApiErrorHandler.createError('Ingredient ID is required', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    // Get user email for change tracking
    let userEmail: string | null = null;
    try {
      const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
      userEmail = (token?.email as string) || null;
    } catch (tokenError) {
      // Continue without user email if auth fails (for development)
      logger.warn('[Ingredients API] Could not get user email for change tracking:', tokenError);
    }

    const data = await updateIngredient(id, updates, userEmail);

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (err: any) {
    if (err.status) {
      return NextResponse.json(err, { status: err.status });
    }
    return handleIngredientError(err, 'PUT');
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        ApiErrorHandler.createError('Ingredient ID is required', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    await deleteIngredient(id);

    return NextResponse.json({
      success: true,
      message: 'Ingredient deleted successfully',
    });
  } catch (err: any) {
    if (err.status) {
      return NextResponse.json(err, { status: err.status });
    }
    return handleIngredientError(err, 'DELETE');
  }
}
