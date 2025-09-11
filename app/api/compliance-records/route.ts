import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ 
        error: 'Database connection not available' 
      }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const typeId = searchParams.get('type_id');
    const status = searchParams.get('status');

    let query = supabaseAdmin
      .from('compliance_records')
      .select(`
        *,
        compliance_types (
          id,
          name,
          description,
          renewal_frequency_days
        )
      `)
      .order('expiry_date', { ascending: true });

    if (typeId) {
      query = query.eq('compliance_type_id', typeId);
    }
    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching compliance records:', error);
      return NextResponse.json({ 
        error: 'Failed to fetch compliance records',
        message: error.message
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: data || []
    });

  } catch (error) {
    console.error('Compliance records fetch error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch compliance records',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      compliance_type_id, 
      document_name, 
      issue_date, 
      expiry_date, 
      document_url, 
      photo_url, 
      notes, 
      reminder_enabled, 
      reminder_days_before 
    } = body;

    if (!compliance_type_id || !document_name) {
      return NextResponse.json({ 
        error: 'Required fields missing',
        message: 'Please provide compliance_type_id and document_name'
      }, { status: 400 });
    }

    // Determine status based on expiry date
    let status = 'active';
    if (expiry_date) {
      const today = new Date();
      const expiry = new Date(expiry_date);
      if (expiry < today) {
        status = 'expired';
      } else if (reminder_days_before) {
        const reminderDate = new Date(expiry);
        reminderDate.setDate(reminderDate.getDate() - reminder_days_before);
        if (today >= reminderDate) {
          status = 'pending_renewal';
        }
      }
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ 
        error: 'Database connection not available' 
      }, { status: 500 });
    }

    const { data, error } = await supabaseAdmin
      .from('compliance_records')
      .insert({
        compliance_type_id,
        document_name,
        issue_date: issue_date || null,
        expiry_date: expiry_date || null,
        status,
        document_url: document_url || null,
        photo_url: photo_url || null,
        notes: notes || null,
        reminder_enabled: reminder_enabled !== undefined ? reminder_enabled : true,
        reminder_days_before: reminder_days_before || 30
      })
      .select(`
        *,
        compliance_types (
          id,
          name,
          description,
          renewal_frequency_days
        )
      `)
      .single();

    if (error) {
      console.error('Error creating compliance record:', error);
      return NextResponse.json({ 
        error: 'Failed to create compliance record',
        message: error.message
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Compliance record created successfully',
      data
    });

  } catch (error) {
    console.error('Compliance record creation error:', error);
    return NextResponse.json({ 
      error: 'Failed to create compliance record',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      id, 
      document_name, 
      issue_date, 
      expiry_date, 
      document_url, 
      photo_url, 
      notes, 
      reminder_enabled, 
      reminder_days_before 
    } = body;

    if (!id) {
      return NextResponse.json({ 
        error: 'ID is required',
        message: 'Please provide an ID for the compliance record to update'
      }, { status: 400 });
    }

    const updateData: any = {};
    if (document_name !== undefined) updateData.document_name = document_name;
    if (issue_date !== undefined) updateData.issue_date = issue_date;
    if (expiry_date !== undefined) updateData.expiry_date = expiry_date;
    if (document_url !== undefined) updateData.document_url = document_url;
    if (photo_url !== undefined) updateData.photo_url = photo_url;
    if (notes !== undefined) updateData.notes = notes;
    if (reminder_enabled !== undefined) updateData.reminder_enabled = reminder_enabled;
    if (reminder_days_before !== undefined) updateData.reminder_days_before = reminder_days_before;

    // Recalculate status if expiry_date changed
    if (expiry_date !== undefined) {
      const today = new Date();
      const expiry = new Date(expiry_date);
      if (expiry < today) {
        updateData.status = 'expired';
      } else if (reminder_days_before !== undefined) {
        const reminderDate = new Date(expiry);
        reminderDate.setDate(reminderDate.getDate() - reminder_days_before);
        if (today >= reminderDate) {
          updateData.status = 'pending_renewal';
        } else {
          updateData.status = 'active';
        }
      }
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ 
        error: 'Database connection not available' 
      }, { status: 500 });
    }

    const { data, error } = await supabaseAdmin
      .from('compliance_records')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        compliance_types (
          id,
          name,
          description,
          renewal_frequency_days
        )
      `)
      .single();

    if (error) {
      console.error('Error updating compliance record:', error);
      return NextResponse.json({ 
        error: 'Failed to update compliance record',
        message: error.message
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Compliance record updated successfully',
      data
    });

  } catch (error) {
    console.error('Compliance record update error:', error);
    return NextResponse.json({ 
      error: 'Failed to update compliance record',
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
        message: 'Please provide an ID for the compliance record to delete'
      }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ 
        error: 'Database connection not available' 
      }, { status: 500 });
    }

    const { error } = await supabaseAdmin
      .from('compliance_records')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting compliance record:', error);
      return NextResponse.json({ 
        error: 'Failed to delete compliance record',
        message: error.message
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Compliance record deleted successfully'
    });

  } catch (error) {
    console.error('Compliance record deletion error:', error);
    return NextResponse.json({ 
      error: 'Failed to delete compliance record',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
