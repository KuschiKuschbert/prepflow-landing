import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_req: NextRequest) {
  try {
    if (!supabaseAdmin) return NextResponse.json({ error: 'DB unavailable' }, { status: 500 });

    const [{ count: ing }, { count: rec }, { data: prices }] = await Promise.all([
      supabaseAdmin.from('ingredients').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('recipes').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('recipes').select('selling_price'),
    ]);

    const valid = (prices || []).map((r: any) => Number(r.selling_price || 0)).filter(v => v > 0);
    const averageDishPrice = valid.length > 0 ? valid.reduce((a, b) => a + b, 0) / valid.length : 0;

    return NextResponse.json({
      success: true,
      totalIngredients: ing || 0,
      totalRecipes: rec || 0,
      averageDishPrice,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || String(e) }, { status: 500 });
  }
}
