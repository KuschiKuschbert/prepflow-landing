/**
 * Roster Templates API Route
 * Handles GET (list templates) and POST (create template) operations.
 *
 * @module api/roster/templates
 */

import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

/**
 * GET /api/roster/templates
 * List roster templates with optional filters.
 *
 * Query parameters:
 * - is_active: Filter by active status (true/false)
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

    let query = supabaseAdmin.from('roster_templates').select('*', { count: 'exact' });

    if (isActive !== null) {
      query = query.eq('is_active', isActive === 'true');
    }

    query = query.order('created_at', { ascending: false });

    const { data: templates, error, count } = await query;

    if (error) {
      logger.error('[Templates API] Database error fetching templates:', {
        error: error.message,
        code: (error as any).code,
        context: { endpoint: '/api/roster/templates', operation: 'GET', table: 'roster_templates' },
      });

      const apiError = ApiErrorHandler.fromSupabaseError(error, 500);
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
 *
 * Request body:
 * - name: Template name (required)
 * - description: Template description (optional)
 * - is_active: Whether template is active (optional, default: true)
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
      logger.warn('[Templates API] Failed to parse request body:', {
        error: err instanceof Error ? err.message : String(err),
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Invalid request body', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    const validationResult = createTemplateSchema.safeParse(body);
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

    const { name, description, is_active } = validationResult.data;

    const templateData = {
      name,
      description: description || null,
      is_active: is_active !== undefined ? is_active : true,
    };

    const { data: template, error: insertError } = await supabaseAdmin
      .from('roster_templates')
      .insert(templateData)
      .select()
      .single();

    if (insertError) {
      logger.error('[Templates API] Database error creating template:', {
        error: insertError.message,
        code: (insertError as any).code,
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
