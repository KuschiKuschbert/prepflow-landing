import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 500 });
    }

    const { data, error } = await supabaseAdmin
      .from('recipe_ingredients')
      .select(
        `
        *,
        ingredients (
          id,
          ingredient_name,
          unit,
          cost_per_unit,
          cost_per_unit_incl_trim,
          trim_peel_waste_percentage
        )
      `,
      )
      .eq('recipe_id', id)
      .order('id');

    if (error) {
      console.error('Error fetching recipe ingredients:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      items: data || [],
    });
  } catch (err) {
    console.error('Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { ingredients, isUpdate } = body;

    if (!ingredients || !Array.isArray(ingredients)) {
      return NextResponse.json(
        { error: 'Missing required field', message: 'Ingredients array is required' },
        { status: 400 },
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 500 });
    }

    // If updating, delete existing ingredients first
    if (isUpdate) {
      const { error: deleteError } = await supabaseAdmin
        .from('recipe_ingredients')
        .delete()
        .eq('recipe_id', id);

      if (deleteError) {
        console.error('Error deleting existing ingredients:', deleteError);
        return NextResponse.json(
          { error: `Failed to update recipe ingredients: ${deleteError.message}` },
          { status: 500 },
        );
      }
    }

    // Insert new ingredients
    const recipeIngredientInserts = ingredients.map((ing: any) => ({
      recipe_id: id,
      ingredient_id: ing.ingredient_id,
      quantity: ing.quantity,
      unit: ing.unit,
    }));

    const { data, error: ingredientsError } = await supabaseAdmin
      .from('recipe_ingredients')
      .insert(recipeIngredientInserts)
      .select();

    if (ingredientsError) {
      console.error('Error saving recipe ingredients:', ingredientsError);
      return NextResponse.json(
        { error: `Failed to save recipe ingredients: ${ingredientsError.message}` },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Recipe ingredients saved successfully',
      data: data || [],
    });
  } catch (err) {
    console.error('Unexpected error:', err);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: err instanceof Error ? err.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
