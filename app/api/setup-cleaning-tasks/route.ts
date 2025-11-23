import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

import { logger } from '@/lib/logger';

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
      return NextResponse.json(
        {
          error: 'Migration file not found',
          message: 'Could not read migrations/fix-cleaning-tasks-schema.sql',
        },
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
    if (!supabaseAdmin) {
      return NextResponse.json(
        {
          success: false,
          error: 'Database connection not available',
          message:
            'Supabase admin client could not be initialized. Please check your environment variables.',
          tablesExist: false,
          instructions: [
            'Supabase is not configured. Please check:',
            '1. NEXT_PUBLIC_SUPABASE_URL is set in .env.local',
            '2. SUPABASE_SERVICE_ROLE_KEY is set in .env.local',
            '3. Restart your dev server after adding environment variables',
          ],
        },
        { status: 500 },
      );
    }

    // Check if cleaning_areas table exists
    const { error: areasError } = await supabaseAdmin.from('cleaning_areas').select('id').limit(1);

    if (areasError && areasError.code === '42P01') {
      return NextResponse.json({
        success: false,
        message: 'Cleaning areas table not found',
        tablesExist: false,
        instructions: [
          'The cleaning_areas table has not been created yet.',
          'Please run the migration SQL in your Supabase SQL Editor:',
          '1. Visit /api/setup-cleaning-tasks (GET) to get the SQL',
          '2. Or open migrations/fix-cleaning-tasks-schema.sql from the project root',
          '3. Copy the SQL and run it in Supabase SQL Editor',
        ],
      });
    }

    // Check if cleaning_tasks table exists
    const { error: tasksError } = await supabaseAdmin.from('cleaning_tasks').select('id').limit(1);

    if (tasksError && tasksError.code === '42P01') {
      return NextResponse.json({
        success: false,
        message: 'Cleaning tasks table not found',
        tablesExist: false,
        instructions: [
          'The cleaning_tasks table has not been created yet.',
          'Please run the migration SQL in your Supabase SQL Editor.',
        ],
      });
    }

    // Check if description column exists
    const { error: descCheckError } = await supabaseAdmin
      .from('cleaning_tasks')
      .select('description')
      .limit(1);

    if (descCheckError) {
      const errorMessage = descCheckError.message || '';
      if (errorMessage.includes('description') || errorMessage.includes('column')) {
        return NextResponse.json({
          success: false,
          message: 'Cleaning tasks table is missing the description column',
          tablesExist: false,
          missingColumn: 'description',
          instructions: [
            'The cleaning_tasks table exists but is missing the description column.',
            'Please run the migration SQL to add missing columns:',
            '1. Visit /api/setup-cleaning-tasks (GET) to get the SQL',
            '2. Copy and run it in Supabase SQL Editor',
          ],
        });
      }
    }

    // Check if foreign key relationship exists by trying to query with join
    const { error: fkError } = await supabaseAdmin
      .from('cleaning_tasks')
      .select('id, cleaning_areas(id)')
      .limit(1);

    if (fkError) {
      const errorMessage = fkError.message || '';
      if (errorMessage.includes('relationship') || errorMessage.includes('foreign key')) {
        return NextResponse.json({
          success: false,
          message: 'Foreign key relationship missing between cleaning_tasks and cleaning_areas',
          tablesExist: false,
          missingForeignKey: true,
          instructions: [
            'The foreign key relationship is missing.',
            'Please run the migration SQL to add the foreign key:',
            '1. Visit /api/setup-cleaning-tasks (GET) to get the SQL',
            '2. Copy and run it in Supabase SQL Editor',
          ],
        });
      }
    }

    // Check if cleaning_task_completions table exists
    const { error: completionsError } = await supabaseAdmin
      .from('cleaning_task_completions')
      .select('id')
      .limit(1);

    if (completionsError && completionsError.code === '42P01') {
      return NextResponse.json({
        success: false,
        message: 'Cleaning task completions table not found',
        tablesExist: false,
        missingTable: 'cleaning_task_completions',
        instructions: [
          'The cleaning_task_completions table has not been created yet.',
          'Please run the migration SQL to create it.',
        ],
      });
    }

    // All tables and columns exist
    return NextResponse.json({
      success: true,
      message: 'Cleaning tasks tables are set up correctly',
      tablesExist: true,
    });
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
