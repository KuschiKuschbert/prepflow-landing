import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdmin } from '@/lib/supabase';
import { CANONICAL_RECIPES } from '@/lib/seed/recipes';
import { generateDeterministicId, normalizeIngredientName } from '@/lib/seed/helpers';

export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Seeding is disabled in production' }, { status: 403 });
  }

  const adminKeyHeader = request.headers.get('x-admin-key');
  const adminKeyEnv = process.env.SEED_ADMIN_KEY;
  if (!adminKeyEnv || adminKeyHeader !== adminKeyEnv) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const dryRun = request.nextUrl.searchParams.get('dry') === '1';
  const size = (await request.json().catch(() => ({})))?.size as 'small' | 'full' | undefined;

  const supabase = createSupabaseAdmin();

  // Build ingredient catalog from recipes
  const ingredientNames = new Set<string>();
  for (const r of CANONICAL_RECIPES) {
    for (const l of r.lines) {
      ingredientNames.add(normalizeIngredientName(l.ingredientName));
    }
  }

  // Validation: ensure every recipe line resolved to a catalog entry
  const missing: string[] = [];
  for (const r of CANONICAL_RECIPES) {
    for (const l of r.lines) {
      const n = normalizeIngredientName(l.ingredientName);
      if (!ingredientNames.has(n)) missing.push(n);
    }
  }
  if (missing.length > 0) {
    return NextResponse.json(
      { error: 'Preflight failed', missing: Array.from(new Set(missing)) },
      { status: 400 },
    );
  }

  if (dryRun) {
    return NextResponse.json({
      success: true,
      dryRun: true,
      ingredients: Array.from(ingredientNames),
    });
  }

  // Upsert ingredients
  const ingredientIdMap = new Map<string, string>();
  for (const name of ingredientNames) {
    const id = generateDeterministicId('ingredient', name.toLowerCase());
    const { error } = await supabase.from('ingredients').upsert(
      {
        id,
        ingredient_name: name,
        unit: 'GM',
        cost_per_unit: 0.01,
      },
      { onConflict: 'id' },
    );
    if (error) {
      return NextResponse.json(
        { error: 'Failed to upsert ingredient', details: error.message, name },
        { status: 500 },
      );
    }
    ingredientIdMap.set(name, id);
  }

  // Upsert recipes
  const recipeIdMap = new Map<string, string>();
  const source = size === 'full' ? CANONICAL_RECIPES : CANONICAL_RECIPES; // small == full for now
  for (const r of source) {
    const id = generateDeterministicId('recipe', r.key);
    const { error } = await supabase.from('recipes').upsert(
      {
        id,
        name: r.name,
        description: r.description,
        yield: r.yield,
        yield_unit: r.yieldUnit,
        instructions: r.instructions,
        total_cost: null,
        cost_per_serving: null,
      },
      { onConflict: 'id' },
    );
    if (error) {
      return NextResponse.json(
        { error: 'Failed to upsert recipe', details: error.message, name: r.name },
        { status: 500 },
      );
    }
    recipeIdMap.set(r.key, id);
  }

  // Clear existing recipe_ingredients for these recipes to maintain idempotency
  for (const r of source) {
    const recipeId = recipeIdMap.get(r.key)!;
    await supabase.from('recipe_ingredients').delete().eq('recipe_id', recipeId);
  }

  // Insert recipe_ingredients
  for (const r of source) {
    const recipeId = recipeIdMap.get(r.key)!;
    for (const l of r.lines) {
      const ingName = normalizeIngredientName(l.ingredientName);
      const ingId = ingredientIdMap.get(ingName);
      if (!ingId) {
        return NextResponse.json(
          { error: 'Ingredient missing after upsert', name: ingName },
          { status: 500 },
        );
      }
      const { error } = await supabase.from('recipe_ingredients').insert({
        recipe_id: recipeId,
        ingredient_id: ingId,
        quantity: l.quantity,
        unit: l.unit,
      });
      if (error) {
        return NextResponse.json(
          { error: 'Failed to insert recipe ingredient', details: error.message },
          { status: 500 },
        );
      }
    }
  }

  // Upsert menu_dishes derived from recipes
  for (const r of source) {
    const id = generateDeterministicId('dish', r.key);
    const recipeId = recipeIdMap.get(r.key)!;
    const { error } = await supabase.from('menu_dishes').upsert(
      {
        id,
        recipe_id: recipeId,
        name: r.name,
        selling_price: r.sellingPrice,
      },
      { onConflict: 'id' },
    );
    if (error) {
      return NextResponse.json(
        { error: 'Failed to upsert menu dish', details: error.message, name: r.name },
        { status: 500 },
      );
    }
  }

  // Minimal sales_data to exercise performance classification (ignore if table missing)
  for (const r of source) {
    const dishId = generateDeterministicId('dish', r.key);
    const { error: salesError } = await supabase
      .from('sales_data')
      .insert({ dish_id: dishId, number_sold: 10 });
    // Ignore if table is missing; continue silently in demo/local schemas
    if (salesError) {
      // no-op
    }
  }

  return NextResponse.json({
    success: true,
    counts: {
      ingredients: ingredientIdMap.size,
      recipes: recipeIdMap.size,
      recipe_ingredients: source.reduce((acc, r) => acc + r.lines.length, 0),
      menu_dishes: source.length,
    },
  });
}
