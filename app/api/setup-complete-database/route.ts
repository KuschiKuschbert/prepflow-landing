import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        {
          error: 'Database connection not available',
          message: 'Supabase admin client not initialized',
        },
        { status: 500 },
      );
    }

    // Read the complete SQL script
    const sqlFilePath = path.join(process.cwd(), 'COMPLETE_DATABASE_FIX.sql');
    const sqlScript = fs.readFileSync(sqlFilePath, 'utf8');

    console.log('Executing complete database setup...');

    // Execute the SQL script using Supabase's RPC function
    // Split the script into individual statements to avoid issues with complex scripts
    const statements = sqlScript
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    const results = [];
    const errors = [];

    for (const statement of statements) {
      try {
        console.log(`Executing: ${statement.substring(0, 100)}...`);

        // Use direct SQL execution for DDL statements
        const { data, error } = await supabaseAdmin.rpc('exec_sql', {
          sql_query: statement,
        });

        if (error) {
          console.error(`Error executing statement: ${error.message}`);
          errors.push({
            statement: statement.substring(0, 100),
            error: error.message,
          });
        } else {
          results.push({
            statement: statement.substring(0, 100),
            success: true,
          });
        }
      } catch (err) {
        console.error(`Exception executing statement: ${err}`);
        errors.push({
          statement: statement.substring(0, 100),
          error: err instanceof Error ? err.message : 'Unknown error',
        });
      }
    }

    // If RPC doesn't work, try alternative approach
    if (errors.length > 0 && errors[0].error.includes('function exec_sql')) {
      console.log('RPC function not available, trying direct approach...');

      // Try to execute key statements directly
      const keyStatements = [
        'CREATE EXTENSION IF NOT EXISTS "uuid-ossp"',
        `CREATE TABLE IF NOT EXISTS ingredients (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          ingredient_name VARCHAR(255) NOT NULL,
          brand VARCHAR(255),
          pack_size VARCHAR(100),
          unit VARCHAR(50) NOT NULL,
          cost_per_unit DECIMAL(10,4) NOT NULL,
          cost_per_unit_as_purchased DECIMAL(10,4),
          cost_per_unit_incl_trim DECIMAL(10,4),
          trim_peel_waste_percentage DECIMAL(5,2) DEFAULT 0,
          yield_percentage DECIMAL(5,2) DEFAULT 100,
          supplier VARCHAR(255),
          storage VARCHAR(255),
          product_code VARCHAR(100),
          category VARCHAR(100),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )`,
        `CREATE TABLE IF NOT EXISTS recipes (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          recipe_name VARCHAR(255) NOT NULL,
          description TEXT,
          yield INTEGER NOT NULL DEFAULT 1,
          yield_unit VARCHAR(50) NOT NULL DEFAULT 'servings',
          instructions TEXT,
          prep_time_minutes INTEGER,
          cook_time_minutes INTEGER,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )`,
        `CREATE TABLE IF NOT EXISTS recipe_ingredients (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
          ingredient_id UUID REFERENCES ingredients(id) ON DELETE CASCADE,
          quantity DECIMAL(10,3) NOT NULL,
          unit VARCHAR(50) NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )`,
      ];

      const directResults = [];
      const directErrors = [];

      for (const statement of keyStatements) {
        try {
          console.log(`Executing directly: ${statement.substring(0, 50)}...`);

          // Try using the REST API directly
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/exec_sql`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
                apikey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
              },
              body: JSON.stringify({ sql_query: statement }),
            },
          );

          if (response.ok) {
            directResults.push({ statement: statement.substring(0, 50), success: true });
          } else {
            const errorText = await response.text();
            directErrors.push({ statement: statement.substring(0, 50), error: errorText });
          }
        } catch (err) {
          directErrors.push({
            statement: statement.substring(0, 50),
            error: err instanceof Error ? err.message : 'Unknown error',
          });
        }
      }

      return NextResponse.json({
        success: directErrors.length === 0,
        message:
          directErrors.length === 0
            ? 'Database setup completed successfully!'
            : 'Database setup completed with some errors',
        results: directResults,
        errors: directErrors,
        instructions:
          directErrors.length > 0
            ? {
                note: 'Some statements failed. You may need to create tables manually in Supabase dashboard.',
                nextSteps: [
                  'Go to Supabase Dashboard > SQL Editor',
                  'Copy and paste the COMPLETE_DATABASE_FIX.sql script',
                  'Execute the script manually',
                  'Then run /api/setup-database to populate sample data',
                ],
              }
            : null,
      });
    }

    return NextResponse.json({
      success: errors.length === 0,
      message:
        errors.length === 0
          ? 'Database setup completed successfully!'
          : 'Database setup completed with some errors',
      results: results,
      errors: errors,
      instructions:
        errors.length > 0
          ? {
              note: 'Some statements failed. You may need to create tables manually in Supabase dashboard.',
              nextSteps: [
                'Go to Supabase Dashboard > SQL Editor',
                'Copy and paste the COMPLETE_DATABASE_FIX.sql script',
                'Execute the script manually',
                'Then run /api/setup-database to populate sample data',
              ],
            }
          : null,
    });
  } catch (err) {
    console.error('Unexpected error during database setup:', err);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'Failed to setup database',
        details: err instanceof Error ? err.message : 'Unknown error',
        instructions: {
          note: 'Automatic setup failed. Please create tables manually.',
          steps: [
            'Go to Supabase Dashboard > SQL Editor',
            'Copy and paste the COMPLETE_DATABASE_FIX.sql script',
            'Execute the script manually',
            'Then run /api/setup-database to populate sample data',
          ],
        },
      },
      { status: 500 },
    );
  }
}
