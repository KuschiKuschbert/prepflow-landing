import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { z } from 'zod';

/**
 * GET /api/qualification-types
 * List all qualification types
 */
export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    const { searchParams } = new URL(request.url);
    const isActive = searchParams.get('is_active');

    let query = supabaseAdmin.from('qualification_types').select('*').order('name');

    if (isActive !== null) {
      query = query.eq('is_active', isActive === 'true');
    }

    const { data, error } = await query;

    if (error) {
      logger.error('[Qualification Types API] Database error fetching types:', {
        error: error.message,
        code: (error as any).code,
        context: {
          endpoint: '/api/qualification-types',
          operation: 'GET',
          table: 'qualification_types',
        },
      });

      const apiError = ApiErrorHandler.fromSupabaseError(error, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    return NextResponse.json({
      success: true,
      data: data || [],
    });
  } catch (err) {
    logger.error('[Qualification Types API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/qualification-types', method: 'GET' },
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

const createQualificationTypeSchema = z.object({
  name: z.string().min(1, 'Qualification type name is required'),
  description: z.string().optional(),
  is_required: z.boolean().optional().default(false),
  default_expiry_days: z.number().int().positive().nullable().optional(),
  is_active: z.boolean().optional().default(true),
});

/**
 * POST /api/qualification-types
 * Create a new qualification type
 */
export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch (err) {
      logger.warn('[Qualification Types API] Failed to parse request body:', {
        error: err instanceof Error ? err.message : String(err),
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Invalid request body', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    const validationResult = createQualificationTypeSchema.safeParse(body);
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

    const { name, description, is_required, default_expiry_days, is_active } = validationResult.data;

    const { data, error } = await supabaseAdmin
      .from('qualification_types')
      .insert({
        name,
        description: description || null,
        is_required: is_required !== undefined ? is_required : false,
        default_expiry_days: default_expiry_days || null,
        is_active: is_active !== undefined ? is_active : true,
      })
      .select()
      .single();

    if (error) {
      logger.error('[Qualification Types API] Database error creating type:', {
        error: error.message,
        code: (error as any).code,
        context: {
          endpoint: '/api/qualification-types',
          operation: 'POST',
          table: 'qualification_types',
        },
      });

      const apiError = ApiErrorHandler.fromSupabaseError(error, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Qualification type created successfully',
      data,
    });
  } catch (err) {
    logger.error('[Qualification Types API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/qualification-types', method: 'POST' },
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
