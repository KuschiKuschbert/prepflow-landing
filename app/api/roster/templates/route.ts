/**
 * Roster Templates API Route
 * Handles GET (list templates) and POST (create template) operations.
 *
 * @module api/roster/templates
 */

import { standardAdminChecks } from '@/lib/admin-auth';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import { ZodSchema, z } from 'zod';

async function safeParseBody<T>(req: NextRequest, schema: ZodSchema<T>): Promise<T> {
  let body: unknown;
  try {
    body = await req.json();
  } catch (err) {
    throw ApiErrorHandler.createError('Invalid request body', 'VALIDATION_ERROR', 400);
  }

  const result = schema.safeParse(body);
  if (!result.success) {
    throw ApiErrorHandler.createError(
      result.error.issues[0]?.message || 'Invalid request body',
      'VALIDATION_ERROR',
      400,
    );
  }
  return result.data;
}

/**
 * GET /api/roster/templates
 * List roster templates with optional filters.
 */
export async function GET(request: NextRequest) {
  try {
    const { supabase, error } = await standardAdminChecks(request);
    if (error) return error;
    if (!supabase) throw new Error('Unexpected database state');

    const { searchParams } = new URL(request.url);
    const isActive = searchParams.get('is_active');

    let query = supabase.from('roster_templates').select('*', { count: 'exact' });

    if (isActive !== null) {
      query = query.eq('is_active', isActive === 'true');
    }

    query = query.order('created_at', { ascending: false });

    const { data: templates, error: dbError, count } = await query;

    if (dbError) {
      logger.error('[Templates API] Database error fetching templates:', {
        error: dbError.message,
        code: dbError.code,
        context: { endpoint: '/api/roster/templates', operation: 'GET', table: 'roster_templates' },
      });

      const apiError = ApiErrorHandler.fromSupabaseError(dbError, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    return NextResponse.json({
      success: true,
      templates: templates || [],
      count: count || 0,
    });
  } catch (err) {
    logger.error('[Templates API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/roster/templates', method: 'GET' },
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

const createTemplateSchema = z.object({
  name: z.string().min(1, 'Template name is required'),
  description: z.string().optional(),
  is_active: z.boolean().optional().default(true),
});

/**
 * POST /api/roster/templates
 * Create a new roster template.
 */
export async function POST(request: NextRequest) {
  try {
    const { supabase, error } = await standardAdminChecks(request);
    if (error) return error;
    if (!supabase) throw new Error('Unexpected database state');

    const body = await safeParseBody(request, createTemplateSchema);
    const { name, description, is_active } = body;

    const templateData = {
      name,
      description: description || null,
      is_active: is_active !== undefined ? is_active : true,
    };

    const { data: template, error: insertError } = await supabase
      .from('roster_templates')
      .insert(templateData)
      .select()
      .single();

    if (insertError) {
      logger.error('[Templates API] Database error creating template:', {
        error: insertError.message,
        code: insertError.code,
        context: { endpoint: '/api/roster/templates', operation: 'POST', templateName: name },
      });

      const apiError = ApiErrorHandler.fromSupabaseError(insertError, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    return NextResponse.json({
      success: true,
      template,
      message: 'Template created successfully',
    });
  } catch (err) {
    if (err instanceof NextResponse) return err;

    logger.error('[Templates API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/roster/templates', method: 'POST' },
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
