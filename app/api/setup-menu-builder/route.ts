import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

import { logger } from '@/lib/logger';
import { ApiErrorHandler } from '@/lib/api-error-handler';
export async function GET() {
  try {
    // Read the SQL migration file
    const sqlPath = join(process.cwd(), 'menu-builder-schema.sql');
    let sqlMigration: string;

    try {
      sqlMigration = readFileSync(sqlPath, 'utf-8');
    } catch (err) {
      logger.error('[route.ts] Error in catch block:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    });

      return NextResponse.json(
        ApiErrorHandler.createError('Could not read menu-builder-schema.sql', 'FILE_NOT_FOUND', 500),
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Menu builder migration SQL',
      sql: sqlMigration,
      instructions: [
        '1. Open your Supabase project dashboard',
        '2. Go to SQL Editor (left sidebar)',
        '3. Click "New query"',
        '4. Copy and paste the SQL below',
        '5. Click "Run" to execute',
        '6. Verify tables were created by checking the Table Editor',
      ],
    });
  } catch (err) {
    logger.error('[Setup Menu Builder API] Error reading migration file:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/setup-menu-builder', method: 'GET', operation: 'readMigrationFile' },
    });
    return NextResponse.json(
      ApiErrorHandler.createError(
        err instanceof Error ? err.message : 'Unknown error',
        'SERVER_ERROR',
        500,
      ),
      { status: 500 },
    );
  }
}

export async function POST(_request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        {
          success: false,
          error: 'Database connection not available',
          message: 'Supabase admin client could not be initialized',
          tablesExist: false,
        },
        { status: 500 },
      );
    }

    // Check if dishes table exists (primary table for menu builder)
    const { data, error } = await supabaseAdmin.from('dishes').select('id').limit(1);

    if (error && error.code === '42P01') {
      // Table doesn't exist
      return NextResponse.json({
        success: false,
        message: 'Menu builder tables not found',
        tablesExist: false,
        instructions: [
          'The menu builder tables have not been created yet.',
          'Please run the migration SQL in your Supabase SQL Editor:',
          '1. Visit /api/setup-menu-builder (GET) to get the SQL',
          '2. Or open menu-builder-schema.sql from the project root',
          '3. Copy the SQL and run it in Supabase SQL Editor',
        ],
      });
    }

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: 'Database error',
          message: error.message,
          tablesExist: false,
        },
        { status: 500 },
      );
    }

    // Check other required tables
    const requiredTables = ['menus', 'menu_items', 'dish_recipes', 'dish_ingredients'];
    const missingTables: string[] = [];

    for (const table of requiredTables) {
      const { error: tableError } = await supabaseAdmin.from(table).select('id').limit(1);
      if (tableError && tableError.code !== '42P01') {
        // Log non-table-not-found errors
        logger.warn('[Setup Menu Builder API] Error checking table:', {
          error: tableError.message,
          code: tableError.code,
          context: { table, operation: 'checkTableExists' },
        });
      }
      if (tableError && tableError.code === '42P01') {
        missingTables.push(table);
      }
    }

    if (missingTables.length > 0) {
      return NextResponse.json({
        success: false,
        message: 'Some menu builder tables are missing',
        tablesExist: false,
        missingTables,
        instructions: [
          'Some required tables are missing. Please run the migration SQL in your Supabase SQL Editor.',
        ],
      });
    }

    // All tables exist
    return NextResponse.json({
      success: true,
      message: 'Menu builder tables already exist',
      tablesExist: true,
    });
  } catch (err) {
    logger.error('[Setup Menu Builder API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/setup-menu-builder', method: 'POST', operation: 'setupMenuBuilder' },
    });
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
