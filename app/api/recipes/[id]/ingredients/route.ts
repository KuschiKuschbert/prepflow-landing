import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { CANONICAL_RECIPES } from '@/lib/seed/recipes';
import { generateDeterministicId, normalizeIngredientName } from '@/lib/seed/helpers';

export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const recipeId = id;
    if (!recipeId) {
      return NextResponse.json({ error: 'Missing recipe id' }, { status: 400 });
    }

    const cookieDemo = _req.cookies.get('pf_demo')?.value === '1';
    const demoMode =
      cookieDemo || process.env.NEXT_PUBLIC_DEMO_MODE === '1' || process.env.DEMO_MODE === '1';
    if (demoMode) {
      const recipe = CANONICAL_RECIPES.find(
        r => generateDeterministicId('recipe', r.key) === recipeId,
      );
      if (!recipe) {
        return NextResponse.json({ items: [] });
      }
      const items = recipe.lines.map((l, idx) => {
        const ingredientName = normalizeIngredientName(l.ingredientName);
        const ingId = generateDeterministicId('ingredient', ingredientName.toLowerCase());
        const rowId = generateDeterministicId('ri', `${recipe.key}:${idx}`);
        return {
          id: rowId,
          recipe_id: recipeId,
          ingredient_id: ingId,
          quantity: l.quantity,
          unit: l.unit,
          ingredients: {
            id: ingId,
            ingredient_name: ingredientName,
            cost_per_unit: 0.01,
            unit: l.unit === 'PC' ? 'PC' : l.unit,
            trim_peel_waste_percentage: 0,
            yield_percentage: 100,
            category: null,
            supplier_name: null,
          },
        };
      });
      return NextResponse.json({ items });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 500 });
    }

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
          name,
          unit,
          cost_per_unit,
          trim_peel_waste_percentage,
          yield_percentage,
          category,
          supplier_name
        )
      `,
      )
      .eq('recipe_id', recipeId);

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch ingredients', details: error.message },
        { status: 500 },
      );
    }

    const items = (data || []).map((row: any) => {
      const ing = row.ingredients || {};
      const normalized = {
        id: row.id,
        recipe_id: row.recipe_id,
        ingredient_id: row.ingredient_id,
        quantity: row.quantity,
        unit: row.unit,
        ingredients: {
          id: ing.id,
          ingredient_name: ing.ingredient_name || ing.name, // normalize field
          cost_per_unit: ing.cost_per_unit,
          unit: ing.unit,
          trim_peel_waste_percentage: ing.trim_peel_waste_percentage,
          yield_percentage: ing.yield_percentage,
          category: ing.category,
          supplier_name: ing.supplier_name,
        },
      };
      return normalized;
    });

    return NextResponse.json({ items });
  } catch (e: any) {
    return NextResponse.json(
      { error: 'Unexpected error', details: e?.message || String(e) },
      { status: 500 },
    );
  }
}
