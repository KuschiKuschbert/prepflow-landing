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
    const supplierId = searchParams.get('supplier_id');
    const current = searchParams.get('current');

    let query = supabaseAdmin
      .from('supplier_price_lists')
      .select(
        `
        *,
        suppliers (
          id,
          name,
          contact_person,
          email,
          phone
        )
      `,
      )
      .order('effective_date', { ascending: false });

    if (supplierId) {
      query = query.eq('supplier_id', supplierId);
    }
    if (current !== null) {
      query = query.eq('is_current', current === 'true');
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching supplier price lists:', error);
      return NextResponse.json(
        {
          error: 'Failed to fetch supplier price lists',
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
    console.error('Supplier price lists fetch error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch supplier price lists',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { supplier_id, document_name, document_url, effective_date, expiry_date, notes } = body;

    if (!supplier_id || !document_name || !document_url) {
      return NextResponse.json(
        {
          error: 'Required fields missing',
          message: 'Please provide supplier_id, document_name, and document_url',
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

    // If this is marked as current, set all other price lists for this supplier as not current
    if (body.is_current !== false) {
      await supabaseAdmin
        .from('supplier_price_lists')
        .update({ is_current: false })
        .eq('supplier_id', supplier_id);
    }

    const { data, error } = await supabaseAdmin
      .from('supplier_price_lists')
      .insert({
        supplier_id: parseInt(supplier_id),
        document_name,
        document_url,
        effective_date: effective_date || null,
        expiry_date: expiry_date || null,
        is_current: body.is_current !== false,
        notes: notes || null,
      })
      .select(
        `
        *,
        suppliers (
          id,
          name,
          contact_person,
          email,
          phone
        )
      `,
      )
      .single();

    if (error) {
      console.error('Error creating supplier price list:', error);
      return NextResponse.json(
        {
          error: 'Failed to create supplier price list',
          message: error.message,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Supplier price list created successfully',
      data,
    });
  } catch (error) {
    console.error('Supplier price list creation error:', error);
    return NextResponse.json(
      {
        error: 'Failed to create supplier price list',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, document_name, document_url, effective_date, expiry_date, notes, is_current } =
      body;

    if (!id) {
      return NextResponse.json(
        {
          error: 'ID is required',
          message: 'Please provide an ID for the supplier price list to update',
        },
        { status: 400 },
      );
    }

    const updateData: any = {};
    if (document_name !== undefined) updateData.document_name = document_name;
    if (document_url !== undefined) updateData.document_url = document_url;
    if (effective_date !== undefined) updateData.effective_date = effective_date;
    if (expiry_date !== undefined) updateData.expiry_date = expiry_date;
    if (notes !== undefined) updateData.notes = notes;
    if (is_current !== undefined) updateData.is_current = is_current;

    if (!supabaseAdmin) {
      return NextResponse.json(
        {
          error: 'Database connection not available',
        },
        { status: 500 },
      );
    }

    // If this is being set as current, set all other price lists for this supplier as not current
    if (is_current === true) {
      const { data: currentRecord } = await supabaseAdmin
        .from('supplier_price_lists')
        .select('supplier_id')
        .eq('id', id)
        .single();

      if (currentRecord) {
        await supabaseAdmin
          .from('supplier_price_lists')
          .update({ is_current: false })
          .eq('supplier_id', currentRecord.supplier_id)
          .neq('id', id);
      }
    }

    const { data, error } = await supabaseAdmin
      .from('supplier_price_lists')
      .update(updateData)
      .eq('id', id)
      .select(
        `
        *,
        suppliers (
          id,
          name,
          contact_person,
          email,
          phone
        )
      `,
      )
      .single();

    if (error) {
      console.error('Error updating supplier price list:', error);
      return NextResponse.json(
        {
          error: 'Failed to update supplier price list',
          message: error.message,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Supplier price list updated successfully',
      data,
    });
  } catch (error) {
    console.error('Supplier price list update error:', error);
    return NextResponse.json(
      {
        error: 'Failed to update supplier price list',
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
          message: 'Please provide an ID for the supplier price list to delete',
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

    const { error } = await supabaseAdmin.from('supplier_price_lists').delete().eq('id', id);

    if (error) {
      console.error('Error deleting supplier price list:', error);
      return NextResponse.json(
        {
          error: 'Failed to delete supplier price list',
          message: error.message,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Supplier price list deleted successfully',
    });
  } catch (error) {
    console.error('Supplier price list deletion error:', error);
    return NextResponse.json(
      {
        error: 'Failed to delete supplier price list',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
