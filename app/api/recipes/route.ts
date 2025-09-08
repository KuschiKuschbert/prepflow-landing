import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    const { data: recipes, error } = await supabaseAdmin
      .from('recipes')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching recipes:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      recipes: recipes || [],
      count: recipes?.length || 0
    });

  } catch (err) {
    console.error('Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
