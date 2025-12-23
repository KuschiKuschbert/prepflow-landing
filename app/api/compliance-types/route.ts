import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { z } from 'zod';

const createComplianceTypeSchema = z.object({
  name: z.string().min(1, 'Compliance type name is required'),
  description: z.string().optional(),
  renewal_frequency_days: z.number().int().positive().optional(),
});

export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    // Database uses 'type_name' column based on schema migrations
    const { data, error } = await supabaseAdmin
      .from('compliance_types')
      .select('*')
      .order('type_name', { ascending: true, nullsFirst: false });

    if (error) {
      logger.error('[Compliance Types API] Database error fetching types:', {
        error: error.message,
        code: (error as any).code,
        context: { endpoint: '/api/compliance-types', operation: 'GET', table: 'compliance_types' },
      });

      const apiError = ApiErrorHandler.fromSupabaseError(error, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    // Map 'type_name' to 'name' for frontend compatibility
    const normalizedData = (data || []).map((item: any) => ({
      ...item,
      name: item.type_name || item.name,
    }));

    return NextResponse.json({
      success: true,
      data: normalizedData,
    });
  } catch (err) {
    logger.error('[Compliance Types API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/compliance-types', method: 'GET' },
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
    let body: unknown;
    try {
      body = await request.json();
    } catch (err) {
      logger.warn('[Compliance Types API] Failed to parse request body:', {
        error: err instanceof Error ? err.message : String(err),
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Invalid request body', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    const validationResult = createComplianceTypeSchema.safeParse(body);
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

    const { name, description, renewal_frequency_days } = validationResult.data;

    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    // Database uses 'type_name' column based on schema migrations
    const insertData = {
      type_name: name,
      description: description || null,
      renewal_frequency_days: renewal_frequency_days || null,
    };

    const { data, error } = await supabaseAdmin
      .from('compliance_types')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      logger.error('[Compliance Types API] Database error creating type:', {
        error: error.message,
        code: (error as any).code,
        context: {
          endpoint: '/api/compliance-types',
          operation: 'POST',
          table: 'compliance_types',
        },
      });

      const apiError = ApiErrorHandler.fromSupabaseError(error, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    // Map 'type_name' to 'name' for frontend compatibility
    const normalizedData = {
      ...data,
      name: (data as any).type_name || (data as any).name,
    };

    return NextResponse.json({
      success: true,
      message: 'Compliance type created successfully',
      data: normalizedData,
    });
  } catch (err) {
    logger.error('[Compliance Types API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/compliance-types', method: 'POST' },
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
