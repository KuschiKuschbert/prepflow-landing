import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const name = String(url.searchParams.get('name') || '')
      .toLowerCase()
      .trim();
    if (!name) return NextResponse.json({ success: true, exists: false });
    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    const { data, error } = await supabaseAdmin
      .from('recipes')
      .select('id')
      .ilike('recipe_name', name);
    if (error) {
      logger.error('[Recipes API] Database error checking recipe existence:', {
        error: error.message,
        code: error.code,
        context: { endpoint: '/api/recipes/exists', operation: 'GET', name },
      });
      return NextResponse.json(ApiErrorHandler.fromSupabaseError(error, 500), { status: 500 });
    }
    return NextResponse.json({ success: true, exists: (data || []).length > 0 });
  } catch (e: unknown) {
    logger.error('[Recipes API] Unexpected error checking recipe existence:', {
      error: e instanceof Error ? e.message : String(e),
      stack: e instanceof Error ? e.stack : undefined,
      context: { endpoint: '/api/recipes/exists', method: 'GET' },
    });
    return NextResponse.json(
      ApiErrorHandler.createError('Failed to check recipe existence', 'SERVER_ERROR', 500),
      { status: 500 },
    );
  }
}
