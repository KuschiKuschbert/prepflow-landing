import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';
import { logger } from '@/lib/logger';
import { validateCleaningTables } from './helpers/validateCleaningTables';
import { ApiErrorHandler } from '@/lib/api-error-handler';

/**
 * GET /api/setup-cleaning-tasks
 * Get the cleaning tasks migration SQL
 *
 * @returns {Promise<NextResponse>} Migration SQL and instructions
 */
export async function GET() {
  try {
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

    return NextResponse.json({
      success: true,
      message: 'Cleaning tasks migration SQL',
      sql: sqlMigration,
      instructions: [
        '1. Open your Supabase project dashboard',
        '2. Go to SQL Editor (left sidebar)',
        '3. Click "New query"',
        '4. Copy and paste the SQL below',
        '5. Click "Run" to execute',
        '6. Verify tables were created/updated by checking the Table Editor',
      ],
    });
  } catch (err) {
    logger.error('Error reading migration file:', err);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: err instanceof Error ? err.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

/**
 * POST /api/setup-cleaning-tasks
 * Check if cleaning tasks tables are set up correctly
 *
 * @returns {Promise<NextResponse>} Setup status
 */
export async function POST(_request: NextRequest) {
  try {
    const validation = await validateCleaningTables();
    return NextResponse.json(validation, { status: validation.success ? 200 : 200 });
  } catch (err) {
    logger.error('Unexpected error:', err);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: err instanceof Error ? err.message : 'Unknown error',
        tablesExist: false,
      },
      { status: 500 },
    );
  }
}
