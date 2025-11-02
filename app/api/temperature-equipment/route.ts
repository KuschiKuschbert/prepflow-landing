import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { success: false, error: 'Database connection not available' },
        { status: 500 },
      );
    }

    const { data, error } = await supabaseAdmin
      .from('temperature_equipment')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching temperature equipment:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch temperature equipment' },
        { status: 500 },
      );
    }

    // Apply Queensland food safety standards automatically
    const queenslandCompliantData = data?.map(equipment => {
      const name = equipment.name.toLowerCase();

      // Apply Queensland thresholds based on equipment type
      if (name.includes('freezer') || name.includes('frozen')) {
        return {
          ...equipment,
          min_temp_celsius: -24, // Optimal minimum freezer temperature
          max_temp_celsius: -18, // Queensland freezer standard - must be at or below -18°C
        };
      } else if (name.includes('hot') || name.includes('warming') || name.includes('steam')) {
        return {
          ...equipment,
          min_temp_celsius: 60, // Queensland hot holding standard
          max_temp_celsius: null, // No upper limit for hot holding
        };
      } else {
        // Default to cold storage (fridges, walk-ins, etc.)
        // Set 0°C to 5°C range for optimal food safety
        return {
          ...equipment,
          min_temp_celsius: 0, // Minimum temperature for cold storage
          max_temp_celsius: 5, // Queensland cold storage standard - must be at or below 5°C
        };
      }
    });

    return NextResponse.json({ success: true, data: queenslandCompliantData || [] });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { success: false, error: 'Database connection not available' },
        { status: 500 },
      );
    }

    const body = await request.json();

    const { data, error } = await supabaseAdmin
      .from('temperature_equipment')
      .insert([
        {
          name: body.name,
          equipment_type: body.equipment_type,
          location: body.location || null,
          min_temp_celsius: body.min_temp_celsius || null,
          max_temp_celsius: body.max_temp_celsius || null,
          is_active: body.is_active !== false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating temperature equipment:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to create temperature equipment' },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { success: false, error: 'Database connection not available' },
        { status: 500 },
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Equipment ID is required' },
        { status: 400 },
      );
    }

    const { error } = await supabaseAdmin.from('temperature_equipment').delete().eq('id', id);

    if (error) {
      console.error('Error deleting temperature equipment:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to delete temperature equipment' },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
