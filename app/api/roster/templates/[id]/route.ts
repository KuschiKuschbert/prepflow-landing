/**
 * Roster Template API Route (by ID)
 * Handles GET (get template), PUT (update template), and DELETE (delete template) operations.
 *
 * @module api/roster/templates/[id]
 */

import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { createSupabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { deleteTemplate } from './helpers/deleteTemplate';
import { getTemplate } from './helpers/getTemplate';
import { updateTemplate } from './helpers/updateTemplate';

async function getAuthenticatedUser(request: NextRequest) {
  const supabaseAdmin = createSupabaseAdmin();

  // Authenticate user
  const {
    data: { user },
    error: authError,
  } = await supabaseAdmin.auth.getUser(
    request.headers.get('Authorization')?.replace('Bearer ', '') || '',
  );

  // Fallback/Use Auth0 helper
  const { requireAuth } = await import('@/lib/auth0-api-helpers');
  const authUser = await requireAuth(request);

  // Get user_id from email
  const { data: userData, error: userError } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('email', authUser.email)
    .single();

  if (userError || !userData) {
    throw ApiErrorHandler.createError('User not found', 'NOT_FOUND', 404);
  }
  return { userId: userData.id, supabase: supabaseAdmin };
}

/**
 * GET /api/roster/templates/[id]
 * Get a single template by ID with its template shifts.
 */
export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { userId, supabase } = await getAuthenticatedUser(request);

    const { id } = await context.params;
    return await getTemplate(supabase, id, userId);
  } catch (err) {
    if (err instanceof NextResponse) return err;

    logger.error('[Templates API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/roster/templates/[id]', method: 'GET' },
    });

    if (err && typeof err === 'object' && 'status' in err) {
      return NextResponse.json(err, { status: (err as { status: number }).status || 500 });
    }

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

/**
 * PUT /api/roster/templates/[id]
 * Update an existing template.
 */
const updateTemplateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  is_active: z.boolean().optional(),
});

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { userId, supabase } = await getAuthenticatedUser(request);

    const { id } = await context.params;

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

    const validationResult = updateTemplateSchema.safeParse(body);
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

    return await updateTemplate(supabase, id, validationResult.data, userId);
  } catch (err) {
    if (err instanceof NextResponse) return err;

    logger.error('[Templates API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/roster/templates/[id]', method: 'PUT' },
    });

    if (err && typeof err === 'object' && 'status' in err) {
      return NextResponse.json(err, { status: (err as { status: number }).status || 500 });
    }

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

/**
 * DELETE /api/roster/templates/[id]
 * Delete a template and its template shifts (cascade).
 */
export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { userId, supabase } = await getAuthenticatedUser(request);

    const { id } = await context.params;
    return await deleteTemplate(supabase, id, userId);
  } catch (err) {
    if (err instanceof NextResponse) return err;

    logger.error('[Templates API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/roster/templates/[id]', method: 'DELETE' },
    });

    if (err && typeof err === 'object' && 'status' in err) {
      return NextResponse.json(err, { status: (err as { status: number }).status || 500 });
    }

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
