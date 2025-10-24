import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdmin } from '@/lib/supabase';
import { sampleIngredients } from '@/lib/sample-ingredients-updated';

export async function POST(request: NextRequest) {
  try {
    const supabaseAdmin = createSupabaseAdmin();

    // Check if ingredients table exists by trying to query it
    const { data: testData, error: testError } = await supabaseAdmin
      .from('ingredients')
      .select('id')
      .limit(1);

    if (testError) {
      console.error('Table check error:', testError);
      return NextResponse.json(
        {
          error: 'Database tables do not exist',
          message: 'Please create the database tables first using the create-tables API endpoint',
          instructions:
            'Visit /api/create-tables to get the SQL script, then run it in your Supabase dashboard',
          errorDetails: testError,
        },
        { status: 400 },
      );
    }

    // Use comprehensive Australian kitchen ingredients
    const ingredientsData = sampleIngredients;

    // Insert ingredients
    const { data, error } = await supabaseAdmin.from('ingredients').insert(ingredientsData);

    if (error) {
      console.error('Error inserting ingredients:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `Successfully inserted ${ingredientsData.length} ingredients!`,
      data: data,
    });
  } catch (err) {
    console.error('Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
