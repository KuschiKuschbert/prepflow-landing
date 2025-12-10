import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { readFileSync } from 'fs';
import { NextResponse } from 'next/server';
import { join } from 'path';

/**
 * GET /api/setup-user-avatar
 * Returns the SQL migration for adding the avatar column
 *
 * @returns {Promise<NextResponse>} SQL migration content
 */
export async function GET() {
  try {
    const sqlPath = join(process.cwd(), 'migrations', 'add-user-avatar.sql');
    const sqlMigration = readFileSync(sqlPath, 'utf-8');

    return new NextResponse(sqlMigration, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  } catch (error) {
    logger.error('[Setup Avatar] Failed to read migration file:', error);
    return NextResponse.json(
      {
        error: 'Migration file not found',
        message: 'Could not read migrations/add-user-avatar.sql',
      },
      { status: 500 },
    );
  }
}

/**
 * POST /api/setup-user-avatar
 * Execute the avatar migration SQL directly
 *
 * @returns {Promise<NextResponse>} Migration execution result
 */
export async function POST() {
  try {
    // Guard: dev-only
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        {
          error: 'Migration execution is disabled in production',
          message: 'Please run migrations manually in Supabase SQL Editor for production',
        },
        { status: 403 },
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        {
          error: 'Database connection not available',
          message: 'Supabase admin client could not be initialized',
        },
        { status: 500 },
      );
    }

    // Read the SQL migration file
    const sqlPath = join(process.cwd(), 'migrations', 'add-user-avatar.sql');
    let sqlMigration: string;

    try {
      sqlMigration = readFileSync(sqlPath, 'utf-8');
    } catch (err) {
      return NextResponse.json(
        {
          error: 'Migration file not found',
          message: 'Could not read migrations/add-user-avatar.sql',
        },
        { status: 500 },
      );
    }

    // Split SQL into individual statements (basic splitting by semicolon)
    const statements = sqlMigration
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    const results: { statement: string; success: boolean; error?: string }[] = [];

    // Execute each statement
    for (const statement of statements) {
      try {
        // Use Supabase RPC or direct query execution
        // Note: Supabase JS client doesn't support arbitrary SQL execution
        // We'll need to use the REST API or create a custom RPC function
        // For now, we'll return the SQL for manual execution
        logger.dev('[Setup Avatar] Would execute:', statement.substring(0, 100) + '...');
        results.push({ statement, success: true });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        logger.error('[Setup Avatar] Failed to execute statement:', {
          statement: statement.substring(0, 100),
          error: errorMessage,
        });
        results.push({ statement, success: false, error: errorMessage });
      }
    }

    // Since Supabase JS client doesn't support arbitrary SQL execution,
    // we'll return the SQL for manual execution
    return NextResponse.json({
      success: false,
      message: 'Please run this migration manually in Supabase SQL Editor',
      sql: sqlMigration,
      instructions: [
        '1. Open https://supabase.com/dashboard',
        '2. Select your project',
        '3. Click SQL Editor (left sidebar)',
        '4. Click New query',
        '5. Paste the SQL below',
        '6. Click Run (or press Cmd+Enter)',
      ],
    });
  } catch (error) {
    logger.error('[Setup Avatar] Unexpected error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}



