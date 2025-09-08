import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const recipeId = searchParams.get('recipe_id');

    if (!recipeId) {
      return NextResponse.json({ error: 'recipe_id parameter is required' }, { status: 400 });
    }

    const { data: recipeIngredients, error } = await supabaseAdmin
      .from('recipe_ingredients')
      .select(`
        *,
        ingredients (
          id,
          ingredient_name,
          cost_per_unit,
          unit,
          trim_peel_waste_percentage,
          yield_percentage
        )
      `)
      .eq('recipe_id', recipeId);

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
