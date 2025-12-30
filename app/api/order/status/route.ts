import { logger } from '@/lib/logger';
import { createSupabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

// Prevent caching
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('id');

    if (!orderId) {
      return NextResponse.json({ error: 'Missing order ID' }, { status: 400 });
    }

    const supabaseAdmin = createSupabaseAdmin();

    // Fetch order details securely using service role key
    const { data: order, error } = await supabaseAdmin
      .from('transactions')
      .select('id, order_number, customer_name, fulfillment_status, items_json')
      .eq('id', orderId)
      .single();

    if (error) {
      logger.error('Error fetching order status:', error);
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Success response
    return NextResponse.json({
      id: order.id,
      order_number: order.order_number,
      customer_name: order.customer_name,
      fulfillment_status: order.fulfillment_status,
      items_json: order.items_json,
    });
  } catch (error) {
    logger.error('Error processing order status request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
