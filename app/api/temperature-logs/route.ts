import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');
  const type = searchParams.get('type');
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = parseInt(searchParams.get('pageSize') || '20', 10);

  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { success: false, error: 'Database connection not available' },
        { status: 500 },
      );
    }

    // Build base query with filters
    let query = supabaseAdmin
      .from('temperature_logs')
      .select('*', { count: 'exact' })
      .order('log_date', { ascending: false })
      .order('log_time', { ascending: false });

    if (date) {
      query = query.eq('log_date', date);
    }

    if (type && type !== 'all') {
      query = query.eq('temperature_type', type);
    }

    // Apply pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching temperature logs:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch temperature logs' },
        { status: 500 },
      );
    }

    const total = count || 0;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    return NextResponse.json({
      success: true,
      data: {
        items: data || [],
        total,
        page,
        pageSize,
        totalPages,
      },
    });
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

    // Validate required fields
    if (!body.temperature_celsius || !body.temperature_type) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 },
      );
    }

    // Validate temperature range (reasonable values)
    if (body.temperature_celsius < -50 || body.temperature_celsius > 200) {
      return NextResponse.json(
        { success: false, error: 'Temperature out of reasonable range' },
        { status: 400 },
      );
    }

    const { data, error } = await supabaseAdmin
      .from('temperature_logs')
      .insert([
        {
          log_date: body.log_date || new Date().toISOString().split('T')[0],
          log_time: body.log_time || new Date().toTimeString().split(' ')[0],
          temperature_type: body.temperature_type,
          temperature_celsius: body.temperature_celsius,
          location: body.location || null,
          notes: body.notes || null,
          logged_by: body.logged_by || 'System',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating temperature log:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to create temperature log' },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
