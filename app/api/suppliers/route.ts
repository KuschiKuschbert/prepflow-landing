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
    const active = searchParams.get('active');

    let query = supabaseAdmin
      .from('suppliers')
      .select('*')
      .order('name');

    if (active !== null) {
      query = query.eq('is_active', active === 'true');
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching suppliers:', error);
      return NextResponse.json({ 
        error: 'Failed to fetch suppliers',
        message: error.message
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: data || []
    });

  } catch (error) {
    console.error('Suppliers fetch error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch suppliers',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({
        error: 'Database connection not available'
      }, { status: 500 });
    }

    const body = await request.json();
    const { 
      name, 
      contact_person, 
      email, 
      phone, 
      address, 
      website, 
      payment_terms, 
      delivery_schedule, 
      minimum_order_amount, 
      notes 
    } = body;

    if (!name) {
      return NextResponse.json({ 
        error: 'Name is required',
        message: 'Please provide a supplier name'
      }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('suppliers')
      .insert({
        name,
        contact_person: contact_person || null,
        email: email || null,
        phone: phone || null,
        address: address || null,
        website: website || null,
        payment_terms: payment_terms || null,
        delivery_schedule: delivery_schedule || null,
        minimum_order_amount: minimum_order_amount ? parseFloat(minimum_order_amount) : null,
        notes: notes || null,
        is_active: true
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating supplier:', error);
      return NextResponse.json({ 
        error: 'Failed to create supplier',
        message: error.message
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Supplier created successfully',
      data
    });

  } catch (error) {
    console.error('Supplier creation error:', error);
    return NextResponse.json({ 
      error: 'Failed to create supplier',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({
        error: 'Database connection not available'
      }, { status: 500 });
    }

    const body = await request.json();
    const { 
      id, 
      name, 
      contact_person, 
      email, 
      phone, 
      address, 
      website, 
      payment_terms, 
      delivery_schedule, 
      minimum_order_amount, 
      notes, 
      is_active 
    } = body;

    if (!id) {
      return NextResponse.json({ 
        error: 'ID is required',
        message: 'Please provide an ID for the supplier to update'
      }, { status: 400 });
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (contact_person !== undefined) updateData.contact_person = contact_person;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;
    if (website !== undefined) updateData.website = website;
    if (payment_terms !== undefined) updateData.payment_terms = payment_terms;
    if (delivery_schedule !== undefined) updateData.delivery_schedule = delivery_schedule;
    if (minimum_order_amount !== undefined) updateData.minimum_order_amount = minimum_order_amount ? parseFloat(minimum_order_amount) : null;
    if (notes !== undefined) updateData.notes = notes;
    if (is_active !== undefined) updateData.is_active = is_active;

    const { data, error } = await supabaseAdmin
      .from('suppliers')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating supplier:', error);
      return NextResponse.json({ 
        error: 'Failed to update supplier',
        message: error.message
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Supplier updated successfully',
      data
    });

  } catch (error) {
    console.error('Supplier update error:', error);
    return NextResponse.json({ 
      error: 'Failed to update supplier',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({
        error: 'Database connection not available'
      }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ 
        error: 'ID is required',
        message: 'Please provide an ID for the supplier to delete'
      }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('suppliers')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting supplier:', error);
      return NextResponse.json({ 
        error: 'Failed to delete supplier',
        message: error.message
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Supplier deleted successfully'
    });

  } catch (error) {
    console.error('Supplier deletion error:', error);
    return NextResponse.json({ 
      error: 'Failed to delete supplier',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
