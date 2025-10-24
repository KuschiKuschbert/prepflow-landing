import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        {
          error: 'User ID is required',
          message: 'Please provide a valid user ID',
        },
        { status: 400 },
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        {
          error: 'Database connection not available',
        },
        { status: 500 },
      );
    }

    const { data, error } = await supabaseAdmin
      .from('par_levels')
      .select(
        `
        *,
        ingredients (
          id,
          name,
          unit,
          category
        )
      `,
      )
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching par levels:', error);
      return NextResponse.json(
        {
          error: 'Failed to fetch par levels',
          message: 'Could not retrieve par level data',
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      data: data || [],
    });
  } catch (error) {
    console.error('Par levels API error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'An unexpected error occurred',
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, ingredientId, parLevel, reorderPoint, unit, notes } = body;

    if (!userId || !ingredientId || parLevel === undefined) {
      return NextResponse.json(
        {
          error: 'Missing required fields',
          message: 'User ID, ingredient ID, and par level are required',
        },
        { status: 400 },
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        {
          error: 'Database connection not available',
        },
        { status: 500 },
      );
    }

    // Check if par level already exists for this ingredient
    const { data: existing } = await supabaseAdmin
      .from('par_levels')
      .select('id')
      .eq('user_id', userId)
      .eq('ingredient_id', ingredientId)
      .single();

    if (existing) {
      return NextResponse.json(
        {
          error: 'Par level already exists',
          message: 'This ingredient already has a par level set',
        },
        { status: 409 },
      );
    }

    const { data, error } = await supabaseAdmin
      .from('par_levels')
      .insert({
        user_id: userId,
        ingredient_id: ingredientId,
        par_level: parLevel,
        reorder_point: reorderPoint || parLevel * 0.5, // Default to 50% of par level
        unit: unit,
        notes: notes,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating par level:', error);
      return NextResponse.json(
        {
          error: 'Failed to create par level',
          message: 'Could not save par level data',
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Par level created successfully',
      data,
    });
  } catch (error) {
    console.error('Par levels API error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'An unexpected error occurred',
      },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, parLevel, reorderPoint, unit, notes } = body;

    if (!id || parLevel === undefined) {
      return NextResponse.json(
        {
          error: 'Missing required fields',
          message: 'ID and par level are required',
        },
        { status: 400 },
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        {
          error: 'Database connection not available',
        },
        { status: 500 },
      );
    }

    const { data, error } = await supabaseAdmin
      .from('par_levels')
      .update({
        par_level: parLevel,
        reorder_point: reorderPoint,
        unit: unit,
        notes: notes,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating par level:', error);
      return NextResponse.json(
        {
          error: 'Failed to update par level',
          message: 'Could not update par level data',
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Par level updated successfully',
      data,
    });
  } catch (error) {
    console.error('Par levels API error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'An unexpected error occurred',
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        {
          error: 'Missing ID',
          message: 'Par level ID is required',
        },
        { status: 400 },
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        {
          error: 'Database connection not available',
        },
        { status: 500 },
      );
    }

    const { error } = await supabaseAdmin.from('par_levels').delete().eq('id', id);

    if (error) {
      console.error('Error deleting par level:', error);
      return NextResponse.json(
        {
          error: 'Failed to delete par level',
          message: 'Could not remove par level',
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Par level deleted successfully',
    });
  } catch (error) {
    console.error('Par levels API error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'An unexpected error occurred',
      },
      { status: 500 },
    );
  }
}
