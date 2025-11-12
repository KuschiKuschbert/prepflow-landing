import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = Math.min(parseInt(searchParams.get('pageSize') || '50'), 100);
    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;

    const {
      data: recipes,
      error,
      count,
    } = await supabaseAdmin
      .from('recipes')
      .select('*', { count: 'exact' })
      .order('name')
      .range(start, end);

    if (error) {
      console.error('Error fetching recipes:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      recipes: recipes || [],
      count: count || 0,
      page,
      pageSize,
    });
  } catch (err) {
    console.error('Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, yield: dishPortions, yield_unit } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Missing required field', message: 'Recipe name is required' },
        { status: 400 },
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 500 });
    }

    // Check if recipe already exists
    const { data: existingRecipes, error: checkError } = await supabaseAdmin
      .from('recipes')
      .select('id, name')
      .ilike('name', name.trim());

    const existingRecipe =
      existingRecipes && existingRecipes.length > 0 ? existingRecipes[0] : null;

    if (existingRecipe && !checkError) {
      // Update existing recipe
      const { data: updatedRecipe, error: updateError } = await supabaseAdmin
        .from('recipes')
        .update({
          yield: dishPortions || 1,
          yield_unit: yield_unit || 'servings',
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingRecipe.id)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating recipe:', updateError);
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        recipe: updatedRecipe,
        isNew: false,
      });
    } else {
      // Create new recipe
      const { data: newRecipe, error: createError } = await supabaseAdmin
        .from('recipes')
        .insert({
          name: name.trim(),
          yield: dishPortions || 1,
          yield_unit: yield_unit || 'servings',
        })
        .select()
        .single();

      if (createError) {
        console.error('Error creating recipe:', createError);
        return NextResponse.json({ error: createError.message }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        recipe: newRecipe,
        isNew: true,
      });
    }
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
