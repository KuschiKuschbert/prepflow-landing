import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import { authenticateAndSetup } from './helpers/authenticateAndSetup';
import { checkTableExists } from './helpers/checkTableExists';
import { createParLevel } from './helpers/createParLevel';
import { deleteParLevel } from './helpers/deleteParLevel';
import { fetchParLevels } from './helpers/fetchParLevels';
import { handleParLevelError } from './helpers/handleParLevelError';
import { createParLevelSchema, updateParLevelSchema } from './helpers/schemas';
import { updateParLevel } from './helpers/updateParLevel';

export async function GET(request: NextRequest) {
  try {
    // Authenticate and setup Supabase
    const { supabaseAdmin, error: authError } = await authenticateAndSetup(request);
    if (authError) {
      return authError;
    }

    // Check if table exists
    const { exists, error: tableError } = await checkTableExists(supabaseAdmin!);
    if (tableError) {
      return tableError;
    }

    // Fetch par levels
    const { data, error: fetchError } = await fetchParLevels(supabaseAdmin!);
    if (fetchError) {
      return fetchError;
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
    const { supabaseAdmin, error: authError } = await authenticateAndSetup(request);
    if (authError) {
      return authError;
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch (err) {
      logger.warn('[Par Levels API] Failed to parse request body:', {
        error: err instanceof Error ? err.message : String(err),
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Invalid request body', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    const validationResult = createParLevelSchema.safeParse(body);
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

    const data = await createParLevel(validationResult.data);

    return NextResponse.json({
      success: true,
      message: 'Par level created successfully',
      data,
    });
  } catch (err: unknown) {
    logger.error('[Par Levels API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      context: { endpoint: '/api/par-levels', method: 'POST' },
    });
    if ((err as any).status) {
      return NextResponse.json(err, { status: (err as any).status });
    }
    return handleParLevelError(err, 'POST');
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { supabaseAdmin, error: authError } = await authenticateAndSetup(request);
    if (authError) {
      return authError;
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch (err) {
      logger.warn('[Par Levels API] Failed to parse request body:', {
        error: err instanceof Error ? err.message : String(err),
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Invalid request body', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    const validationResult = updateParLevelSchema.safeParse(body);
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

    const { id, ...updates } = validationResult.data;
    const data = await updateParLevel(id, updates);

    return NextResponse.json({
      success: true,
      message: 'Par level updated successfully',
      data,
    });
  } catch (err: unknown) {
    logger.error('[Par Levels API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      context: { endpoint: '/api/par-levels', method: 'PUT' },
    });
    if ((err as any).status) {
      return NextResponse.json(err, { status: (err as any).status });
    }
    return handleParLevelError(err, 'PUT');
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { supabaseAdmin, error: authError } = await authenticateAndSetup(request);
    if (authError) {
      return authError;
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
  } catch (err: unknown) {
    logger.error('[Par Levels API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      context: { endpoint: '/api/par-levels', method: 'DELETE' },
    });
    if ((err as any).status) {
      return NextResponse.json(err, { status: (err as any).status });
    }
    return handleParLevelError(err, 'DELETE');
  }
}
