import { ApiErrorHandler } from '@/lib/api-error-handler';
import { authOptions } from '@/lib/auth-options';
import { logger } from '@/lib/logger';
import { createSupabaseAdmin } from '@/lib/supabase';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { createParLevel } from './helpers/createParLevel';
import { deleteParLevel } from './helpers/deleteParLevel';
import { handleParLevelError } from './helpers/handleParLevelError';
import { updateParLevel } from './helpers/updateParLevel';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        ApiErrorHandler.createError('Authentication required', 'UNAUTHORIZED', 401),
        { status: 401 },
      );
    }

    let supabaseAdmin;
    try {
      supabaseAdmin = createSupabaseAdmin();
    } catch (supabaseError: any) {
      logger.error('[Par Levels API] Failed to create Supabase admin client:', {
        error: supabaseError instanceof Error ? supabaseError.message : String(supabaseError),
        stack: supabaseError instanceof Error ? supabaseError.stack : undefined,
      });
      return NextResponse.json(
        ApiErrorHandler.createError(
          'Database connection failed. Please check your environment variables.',
          'DATABASE_CONNECTION_ERROR',
          500,
          {
            error: supabaseError instanceof Error ? supabaseError.message : String(supabaseError),
            instructions: [
              'Please ensure SUPABASE_SERVICE_ROLE_KEY is set in your environment variables.',
              'Check your .env.local file or Vercel environment variables.',
            ],
          },
        ),
        { status: 500 },
      );
    }

    // Check if table exists first
    const { error: tableCheckError } = await supabaseAdmin.from('par_levels').select('id').limit(1);

    if (tableCheckError) {
      const errorCode = (tableCheckError as any).code;
      const errorMessage = tableCheckError.message || '';

      logger.error('[Par Levels API] Table check failed:', {
        error: errorMessage,
        code: errorCode,
        fullError: tableCheckError,
        context: { endpoint: '/api/par-levels', operation: 'GET' },
      });

      // Table doesn't exist (42P01) or relation doesn't exist
      if (
        errorCode === '42P01' ||
        errorMessage.includes('relation') ||
        errorMessage.includes('does not exist')
      ) {
        return NextResponse.json(
          ApiErrorHandler.createError(
            'Par levels table does not exist. Please run the migration script.',
            'TABLE_NOT_FOUND',
            400,
            {
              error: errorMessage,
              code: errorCode,
              instructions: [
                'The par_levels table has not been created yet.',
                'Please run the migration SQL in your Supabase SQL Editor:',
                '1. Open migrations/add-par-levels-columns.sql',
                '2. Copy the SQL and run it in Supabase SQL Editor',
                '3. Ensure the par_levels table exists with proper foreign key to ingredients',
              ],
            },
          ),
          { status: 400 },
        );
      }

      // If it's not a table-not-found error, continue to try the query
      // (might be a permissions issue or other error)
    }

    // Try to fetch par levels with ingredient join
    // If join fails, fall back to fetching ingredients separately
    let { data, error } = await supabaseAdmin.from('par_levels').select(
      `
        *,
        ingredients (
          id,
          ingredient_name,
          unit,
          category
        )
      `,
    );

    // If join fails, try without join first to see if table exists
    if (error) {
      const errorCode = (error as any).code;
      const errorMessage = error.message || '';

      // If it's a relationship/join error, try fetching without join
      if (
        errorMessage.includes('relation') ||
        errorMessage.includes('foreign key') ||
        errorMessage.includes('does not exist')
      ) {
        logger.warn('[Par Levels API] Join failed, trying without join:', {
          error: error.message,
          code: errorCode,
        });

        // Try simple select first
        const { data: simpleData, error: simpleError } = await supabaseAdmin
          .from('par_levels')
          .select('*')
          .order('created_at', { ascending: false });

        if (simpleError) {
          // Table or columns don't exist
          return NextResponse.json(
            ApiErrorHandler.createError(
              `Database error: ${simpleError.message}. Please ensure the par_levels table exists and has the required columns.`,
              'DATABASE_ERROR',
              500,
              {
                error: simpleError.message,
                code: errorCode,
                instructions: [
                  'Please run the migration script: migrations/add-par-levels-columns.sql',
                  'Ensure the par_levels table exists with columns: id, ingredient_id, par_level, reorder_point, unit, created_at, updated_at',
                ],
              },
            ),
            { status: 500 },
          );
        }

        // If we got data without join, fetch ingredients separately
        if (simpleData && simpleData.length > 0) {
          const ingredientIds = simpleData
            .map((pl: any) => pl.ingredient_id)
            .filter((id: any) => id);

          if (ingredientIds.length > 0) {
            const { data: ingredientsData } = await supabaseAdmin
              .from('ingredients')
              .select('id, ingredient_name, unit, category')
              .in('id', ingredientIds);

            // Merge ingredients into par levels
            const ingredientsMap = new Map(
              (ingredientsData || []).map((ing: any) => [ing.id, ing]),
            );
            data = simpleData.map((pl: any) => ({
              ...pl,
              ingredients: ingredientsMap.get(pl.ingredient_id) || null,
            }));
            error = null;
          } else {
            data = simpleData.map((pl: any) => ({ ...pl, ingredients: null }));
            error = null;
          }
        } else {
          data = simpleData;
          error = null;
        }
      }
    } else {
      // Success with join, order the results
      if (data) {
        data = data.sort((a: any, b: any) => {
          const aTime = new Date(a.created_at || 0).getTime();
          const bTime = new Date(b.created_at || 0).getTime();
          return bTime - aTime;
        });
      }
    }

    if (error) {
      logger.error('[Par Levels API] Database error fetching par levels:', {
        error: error.message,
        code: (error as any).code,
        details: error,
        context: { endpoint: '/api/par-levels', operation: 'GET', table: 'par_levels' },
      });

      // If it's a foreign key relationship error, provide helpful message
      if (error.message.includes('foreign key') || error.message.includes('relation')) {
        return NextResponse.json(
          ApiErrorHandler.createError(
            'Database relationship error. Please ensure par_levels table has proper foreign key to ingredients.',
            'DATABASE_ERROR',
            500,
            {
              error: error.message,
              instructions: [
                'The par_levels table may be missing the foreign key relationship to ingredients.',
                'Please verify the table structure in Supabase.',
              ],
            },
          ),
          { status: 500 },
        );
      }

      const apiError = ApiErrorHandler.fromSupabaseError(error, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    return NextResponse.json({
      success: true,
      data: data || [],
    });
  } catch (err) {
    logger.error('[Par Levels API] Unexpected error in GET:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      errorType: err?.constructor?.name,
      errorDetails: err,
    });

    // If it's already a NextResponse, return it
    if (err && typeof err === 'object' && 'status' in err && 'json' in err) {
      return err as NextResponse;
    }

    return handleParLevelError(err, 'GET');
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        ApiErrorHandler.createError('Authentication required', 'UNAUTHORIZED', 401),
        { status: 401 },
      );
    }

    const body = await request.json();
    const data = await createParLevel(body);

    return NextResponse.json({
      success: true,
      message: 'Par level created successfully',
      data,
    });
  } catch (err: any) {
    if (err.status) {
      return NextResponse.json(err, { status: err.status });
    }
    return handleParLevelError(err, 'POST');
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        ApiErrorHandler.createError('Authentication required', 'UNAUTHORIZED', 401),
        { status: 401 },
      );
    }

    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        ApiErrorHandler.createError('Par level ID is required', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    const data = await updateParLevel(id, updates);

    return NextResponse.json({
      success: true,
      message: 'Par level updated successfully',
      data,
    });
  } catch (err: any) {
    if (err.status) {
      return NextResponse.json(err, { status: err.status });
    }
    return handleParLevelError(err, 'PUT');
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        ApiErrorHandler.createError('Authentication required', 'UNAUTHORIZED', 401),
        { status: 401 },
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        ApiErrorHandler.createError('Par level ID is required', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    await deleteParLevel(id);

    return NextResponse.json({
      success: true,
      message: 'Par level deleted successfully',
    });
  } catch (err: any) {
    if (err.status) {
      return NextResponse.json(err, { status: err.status });
    }
    return handleParLevelError(err, 'DELETE');
  }
}
