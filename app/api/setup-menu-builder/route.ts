import { createSupabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function GET() {
  try {
    // Read the SQL migration file
    const sqlPath = join(process.cwd(), 'menu-builder-schema.sql');
    let sqlMigration: string;

    try {
      sqlMigration = readFileSync(sqlPath, 'utf-8');
    } catch (err) {
      return NextResponse.json(
        {
          error: 'Migration file not found',
          message: 'Could not read menu-builder-schema.sql',
        },
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
    console.error('Error reading migration file:', err);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: err instanceof Error ? err.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabaseAdmin = createSupabaseAdmin();
    if (!supabaseAdmin) {
      return NextResponse.json(
        {
          error: 'Database connection not available',
          message: 'Supabase admin client could not be initialized',
        },
        { status: 500 },
      );
    }

    // Check if dishes table exists
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
          error: 'Database error',
          message: error.message,
        },
        { status: 500 },
      );
    }

    // Tables exist
    return NextResponse.json({
      success: true,
      message: 'Menu builder tables already exist',
      tablesExist: true,
    });
  } catch (err) {
    console.error('Unexpected error:', err);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: err instanceof Error ? err.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
