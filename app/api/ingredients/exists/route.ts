import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const name = String(url.searchParams.get('ingredient_name') || '')
      .toLowerCase()
      .trim();
    const supplier = url.searchParams.get('supplier') || '';
    const brand = url.searchParams.get('brand') || '';
    const pack_size = url.searchParams.get('pack_size') || '';
    const unit = url.searchParams.get('unit') || '';
    const cost_per_unit = url.searchParams.get('cost_per_unit');

    if (!name) return NextResponse.json({ exists: false });
    if (!supabaseAdmin) return NextResponse.json(ApiErrorHandler.createError('DB unavailable', 'SERVER_ERROR', 500), { status: 500 });

    const { data, error } = await supabaseAdmin
      .from('ingredients')
      .select('id')
      .eq('supplier', supplier)
      .eq('brand', brand)
      .eq('pack_size', pack_size)
      .eq('unit', unit)
      .eq('cost_per_unit', cost_per_unit)
      .ilike('ingredient_name', name);

    if (error) throw ApiErrorHandler.fromSupabaseError(error, 500);
    return NextResponse.json({ exists: (data || []).length > 0 });
  } catch (e: any) {
    logger.error('[route.ts] Error in catch block:', {
      error: e instanceof Error ? e.message : String(e),
      stack: e instanceof Error ? e.stack : undefined,
    });

    return NextResponse.json({ error: e?.message || String(e) }, { status: 500 });
  }
}
