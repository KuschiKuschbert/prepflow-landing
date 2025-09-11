import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ 
        error: 'Database connection not available' 
      }, { status: 500 });
    }

    const { data, error } = await supabaseAdmin
      .from('cleaning_areas')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching cleaning areas:', error);
      return NextResponse.json({ 
        error: 'Failed to fetch cleaning areas',
        message: error.message
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: data || []
    });

  } catch (error) {
    console.error('Cleaning areas fetch error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch cleaning areas',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, frequency_days } = body;

    if (!name) {
      return NextResponse.json({ 
        error: 'Name is required',
        message: 'Please provide a name for the cleaning area'
      }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ 
        error: 'Database connection not available' 
      }, { status: 500 });
    }

    const { data, error } = await supabaseAdmin
      .from('cleaning_areas')
      .insert({
        name,
        description: description || null,
        frequency_days: frequency_days || 7
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating cleaning area:', error);
      return NextResponse.json({ 
        error: 'Failed to create cleaning area',
        message: error.message
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Cleaning area created successfully',
      data
    });

  } catch (error) {
    console.error('Cleaning area creation error:', error);
    return NextResponse.json({ 
      error: 'Failed to create cleaning area',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, description, frequency_days, is_active } = body;

    if (!id) {
      return NextResponse.json({ 
        error: 'ID is required',
        message: 'Please provide an ID for the cleaning area to update'
      }, { status: 400 });
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (frequency_days !== undefined) updateData.frequency_days = frequency_days;
    if (is_active !== undefined) updateData.is_active = is_active;

    if (!supabaseAdmin) {
      return NextResponse.json({ 
        error: 'Database connection not available' 
      }, { status: 500 });
    }

    const { data, error } = await supabaseAdmin
      .from('cleaning_areas')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating cleaning area:', error);
      return NextResponse.json({ 
        error: 'Failed to update cleaning area',
        message: error.message
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Cleaning area updated successfully',
      data
    });

  } catch (error) {
    console.error('Cleaning area update error:', error);
    return NextResponse.json({ 
      error: 'Failed to update cleaning area',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ 
        error: 'ID is required',
        message: 'Please provide an ID for the cleaning area to delete'
      }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ 
        error: 'Database connection not available' 
      }, { status: 500 });
    }

    const { error } = await supabaseAdmin
      .from('cleaning_areas')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting cleaning area:', error);
      return NextResponse.json({ 
        error: 'Failed to delete cleaning area',
        message: error.message
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Cleaning area deleted successfully'
    });

  } catch (error) {
    console.error('Cleaning area deletion error:', error);
    return NextResponse.json({ 
      error: 'Failed to delete cleaning area',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
