import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const name = String(url.searchParams.get('name') || '')
      .toLowerCase()
      .trim();
    if (!name) return NextResponse.json({ exists: false });
    if (!supabaseAdmin) return NextResponse.json({ error: 'DB unavailable' }, { status: 500 });

    const { data, error } = await supabaseAdmin
      .from('recipes')
      .select('id')
      .ilike('name', name);
    if (error) throw error;
    return NextResponse.json({ exists: (data || []).length > 0 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || String(e) }, { status: 500 });
  }
}
