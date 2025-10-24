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

    const { data, error } = await supabaseAdmin.from('compliance_types').select('*').order('name');

    if (error) {
      console.error('Error fetching compliance types:', error);
      return NextResponse.json(
        {
          error: 'Failed to fetch compliance types',
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
    console.error('Compliance types fetch error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch compliance types',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, renewal_frequency_days } = body;

    if (!name) {
      return NextResponse.json(
        {
          error: 'Name is required',
          message: 'Please provide a name for the compliance type',
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
      .from('compliance_types')
      .insert({
        name,
        description: description || null,
        renewal_frequency_days: renewal_frequency_days || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating compliance type:', error);
      return NextResponse.json(
        {
          error: 'Failed to create compliance type',
          message: error.message,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Compliance type created successfully',
      data,
    });
  } catch (error) {
    console.error('Compliance type creation error:', error);
    return NextResponse.json(
      {
        error: 'Failed to create compliance type',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
