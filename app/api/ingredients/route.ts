import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const supabaseAdmin = createSupabaseAdmin();

    const { data, error } = await supabaseAdmin
      .from('ingredients')
      .select('*')
      .order('ingredient_name');

    if (error) {
      console.error('Error fetching ingredients:', error);
      return NextResponse.json(
        {
          error: 'Failed to fetch ingredients',
          details: error.message,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      ingredients: data,
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
