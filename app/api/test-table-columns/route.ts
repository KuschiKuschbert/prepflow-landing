import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const supabaseAdmin = createSupabaseAdmin();

    // Try different column name variations for ingredients table
    const testData = [
      { name: 'Test Ingredient', brand: 'Test Brand' },
      { ingredient_name: 'Test Ingredient', brand: 'Test Brand' },
      { ingredient_name: 'Test Ingredient' },
    ];

    const results = [];

    for (const testRecord of testData) {
      try {
        const { data, error } = await supabaseAdmin.from('ingredients').insert(testRecord).select();

        if (error) {
          results.push({
            testData: testRecord,
            status: 'error',
            error: error.message,
            code: error.code,
          });
        } else {
          results.push({
            testData: testRecord,
            status: 'success',
            data: data,
          });
          // If successful, clean up the test record
          await supabaseAdmin.from('ingredients').delete().eq('id', data[0].id);
        }
      } catch (err) {
        results.push({
          testData: testRecord,
          status: 'error',
          error: err instanceof Error ? err.message : 'Unknown error',
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Column testing completed',
      results: results,
    });
  } catch (err) {
    console.error('Unexpected error:', err);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: err instanceof Error ? err.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
