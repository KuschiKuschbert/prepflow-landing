import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const recipeId = id;
    if (!recipeId) {
      return NextResponse.json({ error: 'Missing recipe id' }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 500 });
    }

    const normalizedId = String(recipeId).trim();
    const { data, error } = await supabaseAdmin
      .from('recipe_ingredients')
      .select(
        `
        id,
        recipe_id,
        ingredient_id,
        quantity,
        unit,
        ingredients (
          id,
          ingredient_name,
          unit,
          cost_per_unit,
          trim_peel_waste_percentage,
          yield_percentage
        )
      `,
      )
      .eq('recipe_id', normalizedId);

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch ingredients', details: error.message },
        { status: 500 },
      );
    }

    if (!data || data.length === 0) {
      console.warn(
        '[recipes/:id/ingredients] No recipe_ingredients found for recipe_id=',
        normalizedId,
      );
      return NextResponse.json({ items: [] });
    }

    // Server-side fallback: if nested ingredients join is missing/null for some rows,
    // do a bulk lookup from ingredients and merge to ensure uniform shape
    let rows: any[] = data;
    const missingNested = rows.some(r => !r.ingredients);
    if (missingNested) {
      console.warn(
        '[recipes/:id/ingredients] Missing nested ingredients join; applying backfill for recipe_id=',
        recipeId,
      );
      const uniqueIds = Array.from(
        new Set(rows.map(r => r.ingredient_id).filter((v: any) => Boolean(v))),
      );
      if (uniqueIds.length > 0) {
        const { data: ingRows, error: ingError } = await supabaseAdmin
          .from('ingredients')
          .select(
            'id, ingredient_name, cost_per_unit, unit, trim_peel_waste_percentage, yield_percentage',
          )
          .in('id', uniqueIds);
        if (!ingError && ingRows) {
          const byId: Record<string, any> = {};
          ingRows.forEach(ir => {
            byId[ir.id] = ir;
          });
          rows = rows.map(r => ({ ...r, ingredients: r.ingredients || byId[r.ingredient_id] }));
        }
      }
    }

    const items = rows.map((row: any) => {
      const ing = row.ingredients || {};
      return {
        id: row.id,
        recipe_id: row.recipe_id,
        ingredient_id: row.ingredient_id,
        quantity: row.quantity,
        unit: row.unit,
        ingredients: {
          id: ing.id,
          ingredient_name: ing.ingredient_name || 'Unknown',
          cost_per_unit: ing.cost_per_unit,
          unit: ing.unit || row.unit || null,
          trim_peel_waste_percentage: ing.trim_peel_waste_percentage,
          yield_percentage: ing.yield_percentage,
        },
      };
    });

    return NextResponse.json({ items });
  } catch (e: any) {
    return NextResponse.json(
      { error: 'Unexpected error', details: e?.message || String(e) },
      { status: 500 },
    );
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
