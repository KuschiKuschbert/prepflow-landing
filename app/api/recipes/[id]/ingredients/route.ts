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

    // Diagnostics: if no rows, log to help detect recipe_id mismatches
    if (!data || data.length === 0) {
      console.warn(
        '[recipes/:id/ingredients] No recipe_ingredients found for recipe_id=',
        recipeId,
      );
      return NextResponse.json({ items: [] });
    }

    // Server-side fallback: if nested ingredients join is missing/null for some rows,
    // do a bulk lookup from ingredients and merge to ensure uniform shape
    let rows: any[] = data;
    const missingNested = rows.some(r => !r.ingredients);
    if (missingNested) {
      const uniqueIds = Array.from(
        new Set(rows.map(r => r.ingredient_id).filter((v: any) => Boolean(v))),
      );
      if (uniqueIds.length > 0) {
        const { data: ingRows, error: ingError } = await supabaseAdmin
          .from('ingredients')
          .select(
            'id, ingredient_name, name, cost_per_unit, unit, trim_peel_waste_percentage, yield_percentage, category, supplier_name',
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
          // Normalize name field so clients can rely on ingredient_name
          ingredient_name: ing.ingredient_name || ing.name,
          cost_per_unit: ing.cost_per_unit,
          unit: ing.unit,
          trim_peel_waste_percentage: ing.trim_peel_waste_percentage,
          yield_percentage: ing.yield_percentage,
          category: ing.category,
          supplier_name: ing.supplier_name,
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
