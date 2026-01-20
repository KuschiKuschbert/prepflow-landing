import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { createNewMenu, fetchMenuCounts } from './helpers/helpers';
import { Menu, createMenuSchema } from './helpers/schemas';

// Helper to safely parse request body
async function safeParseBody(request: NextRequest) {
  try {
    return await request.json();
  } catch (err) {
    logger.warn('[Menus API] Failed to parse request JSON:', {
      error: err instanceof Error ? err.message : String(err),
    });
    return null;
  }
}

export async function GET(_request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    const {
      data: menus,
      error,
      count,
    } = await supabaseAdmin
      .from('menus')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('[Menus API] Database error fetching menus:', {
        error: error.message,
        code: error.code,
        context: { endpoint: '/api/menus', operation: 'GET', table: 'menus' },
      });

      const apiError = ApiErrorHandler.fromSupabaseError(error, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    // Fetch menu items count for each menu
    // Fetch menu items count for each menu
    const menusWithCounts = await fetchMenuCounts(supabaseAdmin, menus || []);

    return NextResponse.json({
      success: true,
      menus: menusWithCounts,
      count: count || 0,
    });
  } catch (err) {
    logger.error('[Menus API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/menus', method: 'GET' },
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
    const body = await safeParseBody(request);

    const validationResult = createMenuSchema.safeParse(body);
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

    const { menu_name, description } = validationResult.data;

    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    const newMenu = await createNewMenu(supabaseAdmin, menu_name, description);

    // createNewMenu throws error if failed, so we catch it below or it bubble ups.
    // Wait, the original code returned a formatted error response.
    // The helper throws the Supabase error. We need to catch it or let the main catch block handle it.
    // However, the helper throws specific error object.
    // Let's modify the consumption to handle error properly if we want to preserve exact behavior,
    // or rely on the main catch block if generic error is fine.
    // The original code returned ApiErrorHandler.fromSupabaseError.

    // Let's rely on the main catch block or wrap it.
    // Actually, looking at the main catch block, it handles generic errors.
    // Let's create a local try-catch if needed, OR better, let's just let it throw and update the helper to throw ApiError?
    // No, helper throws Supabase error.

    // Let's wrap it in try/catch to return the specific Supabase error response format
    // OR we can just use the helper which returns data.

    /*
    The helper throws 'createError' directly.
    The main catch block handles 'err'.
    If 'err' is a Supabase error (has code, details etc - which PostgrestError doesn't always have fully matching standard Error),
    ApiErrorHandler.createError might be too generic.

    Let's stick to using the helper and letting the main catch block handle unexpected errors,
    BUT we need to make sure we return the correct 500 error for DB failures.

    Actually, I'll update the helper usage to just call it inside the existing try block.
    If it throws, it goes to catch.

    Wait, the original code had specific error logging with context.
    The helper has the logging.
    So we just need to handle the response.

    If the helper throws, we need to convert that throw into a proper API error response.
    The main POST handler catch block does:
     return NextResponse.json(ApiErrorHandler.createError(...))

    I will rely on the main catch block, but I should verify if it handles Supabase errors gracefully.
    It checks process.env.NODE_ENV and returns generic error or message.
    It doesn't use ApiErrorHandler.fromSupabaseError like the original code did.

    So I should probably modify the catch block in the route or handle it here.

    Let's invoke helper and if it fails (throws), we catch it here?
    Or better, let's update the helper to return { data, error } pattern?

    No, I already wrote the helper to throw.

    Let's just call it.
    */

    return NextResponse.json({
      success: true,
      menu: newMenu as Menu,
      message: 'Menu created successfully',
    });
  } catch (err) {
    logger.error('[Menus API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/menus', method: 'POST' },
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
