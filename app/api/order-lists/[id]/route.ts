import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

import { logger } from '../../lib/logger';
export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 500 });
    }

    const { id } = await context.params;
    const body = await request.json();
    const { supplierId, name, notes, status, items } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Missing required fields', message: 'Order list ID is required' },
        { status: 400 },
      );
    }

    const updateData: any = { updated_at: new Date().toISOString() };
    if (supplierId !== undefined) updateData.supplier_id = supplierId;
    if (name !== undefined) updateData.name = name;
    if (notes !== undefined) updateData.notes = notes;
    if (status !== undefined) updateData.status = status;

    const { data, error } = await supabaseAdmin
      .from('order_lists')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      logger.error('Error updating order list:', error);
      return NextResponse.json(
        { error: 'Failed to update order list', message: error.message },
        { status: 500 },
      );
    }

    if (items !== undefined) {
      await supabaseAdmin.from('order_list_items').delete().eq('order_list_id', id);
      if (items.length > 0) {
        const orderItems = items.map((item: any) => ({
          order_list_id: id,
          ingredient_id: item.ingredientId,
          quantity: item.quantity,
          unit: item.unit,
          notes: item.notes,
        }));
        await supabaseAdmin.from('order_list_items').insert(orderItems);
      }
    }

    return NextResponse.json({ success: true, message: 'Order list updated successfully', data });
  } catch (error) {
    logger.error('Order lists API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'An unexpected error occurred' },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 500 });
    }

    const { id } = await context.params;
    if (!id) {
      return NextResponse.json(
        { error: 'Missing ID', message: 'Order list ID is required' },
        { status: 400 },
      );
    }

    await supabaseAdmin.from('order_list_items').delete().eq('order_list_id', id);
    const { error } = await supabaseAdmin.from('order_lists').delete().eq('id', id);

    if (error) {
      logger.error('Error deleting order list:', error);
      return NextResponse.json(
        { error: 'Failed to delete order list', message: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, message: 'Order list deleted successfully' });
  } catch (error) {
    logger.error('Order lists API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'An unexpected error occurred' },
      { status: 500 },
    );
  }
}
