import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

// Setup instructions for users (safe string array, not executable code)
const SETUP_INSTRUCTIONS = [
  '1. Open Supabase Dashboard: https://supabase.com/dashboard',
  '2. Select your project',
  '3. Click SQL Editor (left sidebar)',
  '4. Click "New" to create a new script',
  '5. Paste the migrationSQL below',
  '6. Execute using Cmd-Enter or click Run',
] as const;

/**
 * GET /api/curbos/setup-public-tokens
 * Check if curbos_public_tokens table exists and provide setup SQL if needed
 */
export async function GET() {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Supabase admin client not available', 'SERVER_ERROR', 500),
        { status: 500 },
      );
    }

    // Check if table exists
    const { data, error } = await supabaseAdmin.from('curbos_public_tokens').select('id').limit(1);

    if (error) {
      // Table likely doesn't exist
      if (error.code === '42P01' || error.message?.includes('does not exist')) {
        // Read migration file
        let migrationSQL = '';
        try {
          const migrationPath = join(process.cwd(), 'migrations', 'add-curbos-public-tokens.sql');
          migrationSQL = readFileSync(migrationPath, 'utf-8');
        } catch (readError) {
          logger.error('[CurbOS Setup] Error reading migration file:', readError);
          migrationSQL =
            '-- Migration file not found. Please check migrations/add-curbos-public-tokens.sql';
        }

        return NextResponse.json(
          {
            tableExists: false,
            message: 'Table curbos_public_tokens does not exist',
            migrationSQL,
            instructions: SETUP_INSTRUCTIONS,
          },
          { status: 200 },
        );
      }

      // Other database error
      return NextResponse.json(
        {
          tableExists: false,
          error: error.message,
          code: error.code,
        },
        { status: 500 },
      );
    }

    // Table exists
    return NextResponse.json({
      tableExists: true,
      message: 'Table curbos_public_tokens exists and is accessible',
      rowCount: data?.length ?? 0,
    });
  } catch (error) {
    logger.error('[CurbOS Setup] Error checking table:', {
      error: error instanceof Error ? error.message : String(error),
    });

    return NextResponse.json(
      ApiErrorHandler.createError('Internal server error', 'SERVER_ERROR', 500),
      { status: 500 },
    );
  }
}
