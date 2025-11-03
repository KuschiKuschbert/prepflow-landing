import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Dev-only endpoint that merges duplicate ingredients and recipes.
 * Strategy:
 *  - Ingredients: group by normalized composite key; choose survivor by most usages in recipe_ingredients, then newest.
 *  - Recipes: group by lower(name); survivor by most usages in recipe_ingredients, then newest.
 * All updates are best-effort; returns a report of changes.
 */
export async function POST(req: NextRequest) {
  try {
    if (!supabaseAdmin) return NextResponse.json({ error: 'DB unavailable' }, { status: 500 });
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Dedupe execute disabled in production' }, { status: 403 });
    }

    const url = new URL(req.url);
    const dry = url.searchParams.get('dry') === '1';

    // Load ingredients and usages
    const { data: ingredients, error: ingErr } = await supabaseAdmin
      .from('ingredients')
      .select('id, ingredient_name, supplier, brand, pack_size, unit, cost_per_unit, updated_at');
    if (ingErr) throw ingErr;

    const { data: riRows, error: riErr } = await supabaseAdmin
      .from('recipe_ingredients')
      .select('ingredient_id');
    if (riErr) throw riErr;
    const usageByIng: Record<string, number> = {};
    (riRows || []).forEach((r: any) => {
      const id = r.ingredient_id;
      if (!id) return;
      usageByIng[id] = (usageByIng[id] || 0) + 1;
    });

    const ingGroups: Record<string, { ids: string[]; survivor?: string }> = {};
    (ingredients || []).forEach(row => {
      const key = [
        String(row.ingredient_name || '')
          .toLowerCase()
          .trim(),
        row.supplier || '',
        row.brand || '',
        row.pack_size || '',
        row.unit || '',
        row.cost_per_unit ?? '',
      ].join('|');
      if (!ingGroups[key]) ingGroups[key] = { ids: [] };
      ingGroups[key].ids.push(row.id);
    });

    const ingMerges: Array<{ key: string; survivor: string; removed: string[] }> = [];
    for (const [key, group] of Object.entries(ingGroups)) {
      if (group.ids.length <= 1) continue;
      // Choose survivor by usage, then recency
      const enriched = group.ids.map(id => ({ id, usage: usageByIng[id] || 0 }));
      enriched.sort((a, b) => b.usage - a.usage);
      const survivor = enriched[0].id;
      const removed = group.ids.filter(id => id !== survivor);
      group.survivor = survivor;
      ingMerges.push({ key, survivor, removed });
    }

    const ingredientUpdates: any[] = [];
    for (const m of ingMerges) {
      if (dry) continue;
      // Repoint recipe_ingredients to survivor
      if (m.removed.length > 0) {
        await supabaseAdmin
          .from('recipe_ingredients')
          .update({ ingredient_id: m.survivor })
          .in('ingredient_id', m.removed);
        // Delete removed ingredients
        await supabaseAdmin.from('ingredients').delete().in('id', m.removed);
      }
      ingredientUpdates.push(m);
    }

    // Recipes
    const { data: recipes, error: recErr } = await supabaseAdmin
      .from('recipes')
      .select('id, name, updated_at');
    if (recErr) throw recErr;

    const { data: riByRecipe, error: riRecErr } = await supabaseAdmin
      .from('recipe_ingredients')
      .select('recipe_id');
    if (riRecErr) throw riRecErr;
    const usageByRecipe: Record<string, number> = {};
    (riByRecipe || []).forEach((r: any) => {
      const id = r.recipe_id;
      if (!id) return;
      usageByRecipe[id] = (usageByRecipe[id] || 0) + 1;
    });

    const recGroups: Record<string, { ids: string[]; survivor?: string }> = {};
    (recipes || []).forEach(row => {
      const key = String(row.name || '')
        .toLowerCase()
        .trim();
      if (!recGroups[key]) recGroups[key] = { ids: [] };
      recGroups[key].ids.push(row.id);
    });

    const recipeMerges: Array<{ key: string; survivor: string; removed: string[] }> = [];
    for (const [key, group] of Object.entries(recGroups)) {
      if (group.ids.length <= 1) continue;
      const enriched = group.ids.map(id => ({ id, usage: usageByRecipe[id] || 0 }));
      enriched.sort((a, b) => b.usage - a.usage);
      const survivor = enriched[0].id;
      const removed = group.ids.filter(id => id !== survivor);
      group.survivor = survivor;
      recipeMerges.push({ key, survivor, removed });
    }

    const recipeUpdates: any[] = [];
    for (const m of recipeMerges) {
      if (dry) continue;
      if (m.removed.length > 0) {
        // Repoint recipe_ingredients to survivor recipe
        await supabaseAdmin
          .from('recipe_ingredients')
          .update({ recipe_id: m.survivor })
          .in('recipe_id', m.removed);
        // Delete removed recipes
        await supabaseAdmin.from('recipes').delete().in('id', m.removed);
      }
      recipeUpdates.push(m);
    }

    return NextResponse.json({
      success: true,
      dry,
      ingredients: { merges: ingMerges },
      recipes: { merges: recipeMerges },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || String(e) }, { status: 500 });
  }
}
