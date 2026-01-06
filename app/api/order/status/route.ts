import { ApiErrorHandler } from '@/lib/api-error-handler';
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
      return NextResponse.json(
        ApiErrorHandler.createError('Missing order ID', 'MISSING_ORDER_ID', 400),
        { status: 400 },
      );
    }

    const supabaseAdmin = createSupabaseAdmin();

    // Fetch order details securely using service role key
    const { data: order, error } = await supabaseAdmin
      .from('transactions')
      .select('id, order_number, customer_name, fulfillment_status, items_json, customer_id')
      .eq('id', orderId)
      .single();

    if (error) {
      logger.error('Error fetching order status:', error);
      return NextResponse.json(
        ApiErrorHandler.createError('Order not found', 'ORDER_NOT_FOUND', 404),
        { status: 404 },
      );
    }

    // Success response
    return NextResponse.json({
      id: order.id,
      order_number: order.order_number,
      customer_name: order.customer_name,
      customer_id: order.customer_id,
      fulfillment_status: order.fulfillment_status,
      items_json: order.items_json,
    });
  } catch (error) {
    logger.error('Error processing order status request:', error);
    return NextResponse.json(
      ApiErrorHandler.createError('Internal server error', 'INTERNAL_SERVER_ERROR', 500),
      { status: 500 },
    );
  }
}
