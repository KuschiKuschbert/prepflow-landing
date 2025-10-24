import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        {
          error: 'Database connection not available',
        },
        { status: 500 },
      );
    }

    const { searchParams } = new URL(request.url);
    const areaId = searchParams.get('area_id');
    const status = searchParams.get('status');
    const date = searchParams.get('date');

    let query = supabaseAdmin
      .from('cleaning_tasks')
      .select(
        `
        *,
        cleaning_areas (
          id,
          name,
          description,
          frequency_days
        )
      `,
      )
      .order('assigned_date', { ascending: false });

    if (areaId) {
      query = query.eq('area_id', areaId);
    }
    if (status) {
      query = query.eq('status', status);
    }
    if (date) {
      query = query.eq('assigned_date', date);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching cleaning tasks:', error);
      return NextResponse.json(
        {
          error: 'Failed to fetch cleaning tasks',
          message: error.message,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      data: data || [],
    });
  } catch (error) {
    console.error('Cleaning tasks fetch error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch cleaning tasks',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { area_id, assigned_date, notes } = body;

    if (!area_id || !assigned_date) {
      return NextResponse.json(
        {
          error: 'Required fields missing',
          message: 'Please provide area_id and assigned_date',
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
      .from('cleaning_tasks')
      .insert({
        area_id,
        assigned_date,
        notes: notes || null,
        status: 'pending',
      })
      .select(
        `
        *,
        cleaning_areas (
          id,
          name,
          description,
          frequency_days
        )
      `,
      )
      .single();

    if (error) {
      console.error('Error creating cleaning task:', error);
      return NextResponse.json(
        {
          error: 'Failed to create cleaning task',
          message: error.message,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Cleaning task created successfully',
      data,
    });
  } catch (error) {
    console.error('Cleaning task creation error:', error);
    return NextResponse.json(
      {
        error: 'Failed to create cleaning task',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, completed_date, notes, photo_url } = body;

    if (!id) {
      return NextResponse.json(
        {
          error: 'ID is required',
          message: 'Please provide an ID for the cleaning task to update',
        },
        { status: 400 },
      );
    }

    const updateData: any = {};
    if (status !== undefined) updateData.status = status;
    if (completed_date !== undefined) updateData.completed_date = completed_date;
    if (notes !== undefined) updateData.notes = notes;
    if (photo_url !== undefined) updateData.photo_url = photo_url;

    // If marking as completed, set completed_date to now
    if (status === 'completed' && !completed_date) {
      updateData.completed_date = new Date().toISOString();
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
      .from('cleaning_tasks')
      .update(updateData)
      .eq('id', id)
      .select(
        `
        *,
        cleaning_areas (
          id,
          name,
          description,
          frequency_days
        )
      `,
      )
      .single();

    if (error) {
      console.error('Error updating cleaning task:', error);
      return NextResponse.json(
        {
          error: 'Failed to update cleaning task',
          message: error.message,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Cleaning task updated successfully',
      data,
    });
  } catch (error) {
    console.error('Cleaning task update error:', error);
    return NextResponse.json(
      {
        error: 'Failed to update cleaning task',
        message: error instanceof Error ? error.message : 'Unknown error',
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
          error: 'ID is required',
          message: 'Please provide an ID for the cleaning task to delete',
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

    const { error } = await supabaseAdmin.from('cleaning_tasks').delete().eq('id', id);

    if (error) {
      console.error('Error deleting cleaning task:', error);
      return NextResponse.json(
        {
          error: 'Failed to delete cleaning task',
          message: error.message,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Cleaning task deleted successfully',
    });
  } catch (error) {
    console.error('Cleaning task deletion error:', error);
    return NextResponse.json(
      {
        error: 'Failed to delete cleaning task',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
