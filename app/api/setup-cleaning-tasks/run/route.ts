import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';
import { logger } from '@/lib/logger';
import { ApiErrorHandler } from '@/lib/api-error-handler';

/**
 * POST /api/setup-cleaning-tasks/run
 * Execute the cleaning tasks migration SQL directly
 *
 * WARNING: This requires Supabase to have a custom RPC function or uses direct SQL execution.
 * For security, Supabase doesn't allow arbitrary SQL execution via JS client.
 * This endpoint will attempt to execute via REST API if possible.
 *
 * @returns {Promise<NextResponse>} Migration execution result
 */
export async function POST(request: NextRequest) {
  try {
    // Guard: dev-only
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        ApiErrorHandler.createError(
          'Please run migrations manually in Supabase SQL Editor for production',
          'FORBIDDEN',
          403,
        ),
        { status: 403 },
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          'Supabase admin client could not be initialized',
          'DATABASE_ERROR',
          500,
        ),
        { status: 500 },
      );
    }

    // Read the SQL migration file
    const sqlPath = join(process.cwd(), 'migrations', 'fix-cleaning-tasks-schema.sql');
    let sqlMigration: string;

    try {
      sqlMigration = readFileSync(sqlPath, 'utf-8');
    } catch (err) {
      logger.error('[route.ts] Error in catch block:', {
        error: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : undefined,
      });

      return NextResponse.json(
        ApiErrorHandler.createError(
          'Could not read migrations/fix-cleaning-tasks-schema.sql',
          'FILE_NOT_FOUND',
          500,
        ),
        { status: 500 },
      );
    }

    // Split SQL into individual statements (basic splitting by semicolon)
    // Note: This is a simple approach - complex SQL with semicolons in strings won't work
    const statements = sqlMigration
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    const results: { statement: string; success: boolean; error?: string }[] = [];

    // Execute each statement
    // Note: Supabase JS client doesn't support raw SQL execution directly
    // We'll need to use the REST API with service role key
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        {
          error: 'Missing Supabase configuration',
          message: 'NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set',
        },
        { status: 500 },
      );
    }

    // Use Supabase REST API to execute SQL
    // This requires the SQL to be executed via PostgREST or a custom RPC function
    // For now, we'll return instructions since Supabase doesn't allow arbitrary SQL execution
    return NextResponse.json({
      success: false,
      message: 'Supabase JS client does not support executing arbitrary SQL for security reasons.',
      instructions: [
        'Please run the migration manually:',
        '1. Visit http://localhost:3000/api/setup-cleaning-tasks to get the SQL',
        '2. Copy the SQL from the response',
        '3. Open Supabase Dashboard → SQL Editor',
        '4. Paste and run the SQL',
      ],
      alternative: 'Install Supabase CLI: npm install -g supabase',
      sql: sqlMigration,
    });
  } catch (err) {
    logger.error('Error executing migration:', err);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: err instanceof Error ? err.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
