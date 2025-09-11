import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('temperature_equipment')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) {
      console.error('Error fetching temperature equipment:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch temperature equipment' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true, data: data || [] });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { data, error } = await supabaseAdmin
      .from('temperature_equipment')
      .insert([{
        name: body.name,
        equipment_type: body.equipment_type,
        location: body.location || null,
        min_temp_celsius: body.min_temp_celsius || null,
        max_temp_celsius: body.max_temp_celsius || null,
        is_active: body.is_active !== false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating temperature equipment:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to create temperature equipment' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}