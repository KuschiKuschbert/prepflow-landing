import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const supabaseAdmin = createSupabaseAdmin();
    
    const tables = ['ingredients', 'recipes', 'recipe_ingredients', 'menu_dishes', 'users'];
    const results = [];
    
    for (const tableName of tables) {
      try {
        // Get table structure by querying information_schema
        const { data, error } = await supabaseAdmin
          .from('information_schema.columns')
          .select('column_name, data_type, is_nullable, column_default')
          .eq('table_name', tableName)
          .eq('table_schema', 'public')
          .order('ordinal_position');

        if (error) {
          results.push({ 
            table: tableName, 
            status: 'error', 
            error: error.message 
          });
        } else {
          results.push({ 
            table: tableName, 
            status: 'success', 
            columns: data 
          });
        }
      } catch (err) {
        results.push({ 
          table: tableName, 
          status: 'error', 
          error: err instanceof Error ? err.message : 'Unknown error' 
        });
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Table structure analysis completed',
      results: results
    });

  } catch (err) {
    console.error('Unexpected error:', err);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: err instanceof Error ? err.message : 'Unknown error'
    }, { status: 500 });
  }
}
