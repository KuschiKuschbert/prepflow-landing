import { sampleIngredients } from '@/lib/sample-ingredients-updated';
import { createSupabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

import { logger } from '@/lib/logger';
export async function POST(request: NextRequest) {
  try {
    // cleaned: Added environment protection to prevent demo data in production
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        {
          error: 'Demo data seeding is not allowed in production',
          message: 'This endpoint is only available in development mode',
        },
        { status: 403 },
      );
    }

    const supabaseAdmin = createSupabaseAdmin();

    // Check if ingredients table exists by trying to query it
    const { data: testData, error: testError } = await supabaseAdmin
      .from('ingredients')
      .select('id')
      .limit(1);

    if (testError) {
      logger.error('Table check error:', testError);
      return NextResponse.json(
        {
          error: "Data tables don't exist",
          message: "Please create the data tables first using the create-tables API endpoint",
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
      logger.error('Error inserting ingredients:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `Successfully inserted ${ingredientsData.length} ingredients!`,
      data: data,
    });
  } catch (err) {
    logger.error('Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
