import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ 
        error: 'User ID is required',
        message: 'Please provide a valid user ID'
      }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ 
        error: 'Database connection not available' 
      }, { status: 500 });
    }

    const { data, error } = await supabaseAdmin
      .from('kitchen_sections')
      .select(`
        *,
        menu_dishes (
          id,
          name,
          description,
          selling_price,
          category
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching kitchen sections:', error);
      return NextResponse.json({ 
        error: 'Failed to fetch kitchen sections',
        message: 'Could not retrieve kitchen section data'
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true,
      data: data || []
    });

  } catch (error) {
    console.error('Kitchen sections API error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      message: 'An unexpected error occurred'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, name, description, color } = body;

    if (!userId || !name) {
      return NextResponse.json({ 
        error: 'Missing required fields',
        message: 'User ID and name are required'
      }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ 
        error: 'Database connection not available' 
      }, { status: 500 });
    }

    const { data, error } = await supabaseAdmin
      .from('kitchen_sections')
      .insert({
        user_id: userId,
        name: name,
        description: description,
        color: color || '#29E7CD',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating kitchen section:', error);
      return NextResponse.json({ 
        error: 'Failed to create kitchen section',
        message: 'Could not save kitchen section data'
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true,
      message: 'Kitchen section created successfully',
      data
    });

  } catch (error) {
    console.error('Kitchen sections API error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      message: 'An unexpected error occurred'
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, description, color } = body;

    if (!id) {
      return NextResponse.json({ 
        error: 'Missing required fields',
        message: 'Kitchen section ID is required'
      }, { status: 400 });
    }

    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (color !== undefined) updateData.color = color;

    if (!supabaseAdmin) {
      return NextResponse.json({ 
        error: 'Database connection not available' 
      }, { status: 500 });
    }

    const { data, error } = await supabaseAdmin
      .from('kitchen_sections')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating kitchen section:', error);
      return NextResponse.json({ 
        error: 'Failed to update kitchen section',
        message: 'Could not update kitchen section data'
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true,
      message: 'Kitchen section updated successfully',
      data
    });

  } catch (error) {
    console.error('Kitchen sections API error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      message: 'An unexpected error occurred'
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ 
        error: 'Missing ID',
        message: 'Kitchen section ID is required'
      }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ 
        error: 'Database connection not available' 
      }, { status: 500 });
    }

    // First, remove section assignment from all dishes
    await supabaseAdmin
      .from('menu_dishes')
      .update({ kitchen_section_id: null })
      .eq('kitchen_section_id', id);

    // Then delete the kitchen section
    const { error } = await supabaseAdmin
      .from('kitchen_sections')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting kitchen section:', error);
      return NextResponse.json({ 
        error: 'Failed to delete kitchen section',
        message: 'Could not remove kitchen section'
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true,
      message: 'Kitchen section deleted successfully'
    });

  } catch (error) {
    console.error('Kitchen sections API error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      message: 'An unexpected error occurred'
    }, { status: 500 });
  }
}
