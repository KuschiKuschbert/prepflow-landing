import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ 
        error: 'Database connection not available',
        message: 'Supabase admin client not initialized'
      }, { status: 500 });
    }

    console.log('Checking all database tables...');

    // List of tables to check
    const tablesToCheck = [
      'ingredients',
      'recipes', 
      'recipe_ingredients',
      'menu_dishes',
      'sales_data',
      'temperature_equipment',
      'temperature_logs',
      'cleaning_areas',
      'cleaning_tasks',
      'suppliers',
      'compliance_types',
      'compliance_records',
      'par_levels',
      'order_lists',
      'order_items',
      'kitchen_sections',
      'prep_lists',
      'prep_list_items',
      'ai_specials',
      'ai_specials_ingredients',
      'users'
    ];

    const results: { [key: string]: any } = {};

    for (const tableName of tablesToCheck) {
      try {
        console.log(`Checking table: ${tableName}`);
        
        // Try to query the table to see if it exists and get its structure
        const { data, error } = await supabaseAdmin
          .from(tableName)
          .select('*')
          .limit(1);

        if (error) {
          if (error.code === 'PGRST116') {
            // Table doesn't exist
            results[tableName] = {
              exists: false,
              error: 'Table does not exist'
            };
          } else {
            // Table exists but has an error (might be empty or structure issue)
            results[tableName] = {
              exists: true,
              error: error.message,
              code: error.code
            };
          }
        } else {
          // Table exists and is accessible
          results[tableName] = {
            exists: true,
            accessible: true,
            rowCount: data ? data.length : 0,
            columns: data && data.length > 0 ? Object.keys(data[0]) : []
          };
        }
      } catch (err) {
        results[tableName] = {
          exists: false,
          error: err instanceof Error ? err.message : 'Unknown error'
        };
      }
    }

    // Count existing vs missing tables
    const existingTables = Object.values(results).filter(r => r.exists).length;
    const missingTables = Object.values(results).filter(r => !r.exists).length;

    return NextResponse.json({
      success: true,
      message: `Found ${existingTables} existing tables, ${missingTables} missing tables`,
      summary: {
        total: tablesToCheck.length,
        existing: existingTables,
        missing: missingTables
      },
      tables: results,
      missingTables: Object.entries(results)
        .filter(([_, info]) => !info.exists)
        .map(([name, _]) => name)
    });

  } catch (err) {
    console.error('Error checking tables:', err);
    return NextResponse.json({ 
      error: 'Internal server error',
      message: 'Failed to check database tables',
      details: err instanceof Error ? err.message : 'Unknown error'
    }, { status: 500 });
  }
}
