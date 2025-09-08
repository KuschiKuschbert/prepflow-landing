import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST() {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 500 });
    }

    // Get a recipe ID
    const { data: recipes } = await supabaseAdmin
      .from('recipes')
      .select('id')
      .limit(1);

    if (!recipes || recipes.length === 0) {
      return NextResponse.json({ error: 'No recipes found' }, { status: 400 });
    }

    // Get an ingredient ID
    const { data: ingredients } = await supabaseAdmin
      .from('ingredients')
      .select('id')
      .eq('ingredient_name', 'Beef Mince Premium')
      .limit(1);

    if (!ingredients || ingredients.length === 0) {
      return NextResponse.json({ error: 'Beef Mince Premium not found' }, { status: 400 });
    }

    // Try to insert a recipe ingredient
    const { data, error } = await supabaseAdmin
      .from('recipe_ingredients')
      .insert({
        recipe_id: recipes[0].id,
        ingredient_id: ingredients[0].id,
        quantity: 150,
        unit: 'GM'
      });

    if (error) {
      console.error('Error inserting recipe ingredient:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Recipe ingredient inserted successfully',
      data: data
    });

  } catch (err) {
    console.error('Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
