import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 500 });
    }

    const { data: recipeIngredients, error } = await supabaseAdmin
      .from('recipe_ingredients')
      .select('*')
      .limit(10);

    if (error) {
      console.error('Error fetching recipe ingredients:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      recipeIngredients: recipeIngredients || [],
      count: recipeIngredients?.length || 0
    });

  } catch (err) {
    console.error('Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
