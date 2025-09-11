import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { success: false, error: 'Database connection not available' },
        { status: 500 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('temperature_thresholds')
      .select('*')
      .order('temperature_type', { ascending: true });
    
    if (error) {
      console.error('Error fetching temperature thresholds:', error);
      
      // Return default thresholds if table doesn't exist
      const defaultThresholds = [
        { id: 1, temperature_type: 'fridge', min_temp_celsius: 0, max_temp_celsius: 5, alert_enabled: true },
        { id: 2, temperature_type: 'freezer', min_temp_celsius: -23, max_temp_celsius: -18, alert_enabled: true },
        { id: 3, temperature_type: 'food_cooking', min_temp_celsius: 75, max_temp_celsius: null, alert_enabled: true },
        { id: 4, temperature_type: 'food_hot_holding', min_temp_celsius: 60, max_temp_celsius: null, alert_enabled: true },
        { id: 5, temperature_type: 'food_cold_holding', min_temp_celsius: null, max_temp_celsius: 5, alert_enabled: true },
        { id: 6, temperature_type: 'storage', min_temp_celsius: 10, max_temp_celsius: 21, alert_enabled: false }
      ];
      
      return NextResponse.json({ success: true, data: defaultThresholds });
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

export async function PUT(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { success: false, error: 'Database connection not available' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { id, ...updateData } = body;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Threshold ID is required' },
        { status: 400 }
      );
    }
    
    const { data, error } = await supabaseAdmin
      .from('temperature_thresholds')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating temperature threshold:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to update temperature threshold' },
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