'use client';

import { Utensils } from 'lucide-react';
import { useParams } from 'next/navigation';
import { OrderItemsList } from './components/OrderItemsList';
import { OrderStatusCard } from './components/OrderStatusCard';
import { useOrderNotification } from './hooks/useOrderNotification';
import { useOrderStatus } from './hooks/useOrderStatus';
import { OrderItem } from './types';

/**
 * Public order status page.
 * Displays real-time status of an order for customers.
 */
export default function PublicOrderStatusPage() {
  const params = useParams();
  const id = params?.id as string;

  const {
      order,
      loading,
      error,
      elapsedMillis,
      isReadyRef
  } = useOrderStatus(id);

  useOrderNotification(order, isReadyRef);

  // Graceful 404 handling during sync delay
  // If error is 404 (Order not found) and we've been polling for less than 10 seconds, show a "Preparing" state
  const isSyncDelay = error === 'Order not found' && elapsedMillis < 10000;

  if (loading || isSyncDelay) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#ccff00]"></div>
        {isSyncDelay && (
           <p className="text-neutral-500 text-sm animate-pulse">Syncing your order...</p>
        )}
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-neutral-900 p-8 rounded-2xl border border-neutral-800">
             <Utensils size={48} className="text-neutral-600 mb-4 mx-auto" />
             <h1 className="text-xl font-bold mb-2">Order Not Found</h1>
             <p className="text-neutral-400">We couldn't find an order with this ID. Please check the link and try again.</p>
        </div>
      </div>
    );
  }

  // Parse items safely
  let items: OrderItem[] = [];
  try {
      items = typeof order.items_json === 'string'
        ? (JSON.parse(order.items_json) as OrderItem[])
        : (order.items_json as OrderItem[]) || [];
  } catch (e) {}

  return (
    <div className="min-h-screen bg-black text-white font-sans p-4">
      <div className="max-w-md mx-auto space-y-6 pt-8">

        {/* Header */}
        <div className="text-center space-y-2">
            <h1 className="text-3xl font-black tracking-tight">CurbOS</h1>
            <p className="text-neutral-500 text-sm">Order Tracking</p>
        </div>

        {/* Status Card */}
        <OrderStatusCard order={order} />

        {/* Order Details */}
        <OrderItemsList items={items} />

        <div className="text-center pt-8">
            <p className="text-neutral-600 text-xs">
                Powered by CurbOS
            </p>
        </div>

      </div>
    </div>
  );
}
