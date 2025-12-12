/**
 * Helper for validating cleaning tasks table setup
 */

import { supabaseAdmin } from '@/lib/supabase';

export interface ValidationResult {
  success: boolean;
  message: string;
  tablesExist: boolean;
  missingColumn?: string;
  missingTable?: string;
  missingForeignKey?: boolean;
  instructions: string[];
}

/**
 * Validates cleaning tasks table setup
 *
 * @returns {Promise<ValidationResult>} Validation result
 */
export async function validateCleaningTables(): Promise<ValidationResult> {
  if (!supabaseAdmin) {
    return {
      success: false,
      message: 'Database connection not available',
      tablesExist: false,
      instructions: [
        'Supabase is not configured. Please check:',
        '1. NEXT_PUBLIC_SUPABASE_URL is set in .env.local',
        '2. SUPABASE_SERVICE_ROLE_KEY is set in .env.local',
        '3. Restart your dev server after adding environment variables',
      ],
    };
  }

  // Check if cleaning_areas table exists
  const { error: areasError } = await supabaseAdmin.from('cleaning_areas').select('id').limit(1);

  if (areasError && areasError.code === '42P01') {
    return {
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
    };
  }

  // Check if cleaning_tasks table exists
  const { error: tasksError } = await supabaseAdmin.from('cleaning_tasks').select('id').limit(1);

  if (tasksError && tasksError.code === '42P01') {
    return {
      success: false,
      message: 'Cleaning tasks table not found',
      tablesExist: false,
      instructions: [
        'The cleaning_tasks table has not been created yet.',
        'Please run the migration SQL in your Supabase SQL Editor.',
      ],
    };
  }

  // Check if description column exists
  const { error: descCheckError } = await supabaseAdmin
    .from('cleaning_tasks')
    .select('description')
    .limit(1);

  if (descCheckError) {
    const errorMessage = descCheckError.message || '';
    if (errorMessage.includes('description') || errorMessage.includes('column')) {
      return {
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
      };
    }
  }

  // Check if foreign key relationship exists
  const { error: fkError } = await supabaseAdmin
    .from('cleaning_tasks')
    .select('id, cleaning_areas(id)')
    .limit(1);

  if (fkError) {
    const errorMessage = fkError.message || '';
    if (errorMessage.includes('relationship') || errorMessage.includes('foreign key')) {
      return {
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
      };
    }
  }

  // Check if cleaning_task_completions table exists
  const { error: completionsError } = await supabaseAdmin
    .from('cleaning_task_completions')
    .select('id')
    .limit(1);

  if (completionsError && completionsError.code === '42P01') {
    return {
      success: false,
      message: 'Cleaning task completions table not found',
      tablesExist: false,
      missingTable: 'cleaning_task_completions',
      instructions: [
        'The cleaning_task_completions table has not been created yet.',
        'Please run the migration SQL to create it.',
      ],
    };
  }

  // All tables and columns exist
  return {
    success: true,
    message: 'Cleaning tasks tables are set up correctly',
    tablesExist: true,
    instructions: [],
  };
}




