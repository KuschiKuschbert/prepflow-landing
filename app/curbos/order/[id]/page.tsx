'use client';

import { logger } from '@/lib/logger';
import { Check, ChefHat, Clock, Utensils } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface OrderStatus {
  id: string;
  order_number: number | null;
  customer_name: string | null;
  fulfillment_status: 'PENDING' | 'IN_PROGRESS' | 'READY' | 'COMPLETED';
  items_json: any;
}

/**
 * Public order status page.
 * Displays real-time status of an order for customers.
 */
export default function PublicOrderStatusPage() {
  const params = useParams();
  const id = params?.id as string;

  const [order, setOrder] = useState<OrderStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startTime] = useState(Date.now());
  const [elapsedMillis, setElapsedMillis] = useState(0);

  useEffect(() => {
    if (!id) return;

    const fetchStatus = async () => {
      try {
        const res = await fetch(`/api/order/status?id=${id}`);
        if (!res.ok) {
            if (res.status === 404) throw new Error('Order not found');
            throw new Error('Failed to fetch status');
        }
        const data = await res.json();
        setOrder(data);
        setError(null);
      } catch (err) {
        logger.error('Failed to load order status', { error: err });
        setError(err instanceof Error ? err.message : 'Could not load order status.');
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchStatus();

    // Poll every 5 seconds
    const interval = setInterval(() => {
        setElapsedMillis(Date.now() - startTime);
        fetchStatus();
    }, 5000);
    return () => clearInterval(interval);
  }, [id]);

  // Graceful 404 handling during sync delay
  // If error is 404 (Order not found) and we've been polling for less than 10 seconds, show a "Preparing" state
  const isSyncDelay = error === 'Order not found' && elapsedMillis < 10000;

  if (loading || isSyncDelay) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#C0FF02]"></div>
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
  let items: any[] = [];
  try {
      items = typeof order.items_json === 'string'
        ? JSON.parse(order.items_json)
        : order.items_json || [];
  } catch (e) {}

  // Determine UI State based on status
  const isCooking = order.fulfillment_status === 'IN_PROGRESS' || order.fulfillment_status === 'PENDING';
  const isReady = order.fulfillment_status === 'READY';
  const isCompleted = order.fulfillment_status === 'COMPLETED';

  let statusColor = 'text-neutral-400';
  let statusBg = 'bg-neutral-900';
  let statusBorder = 'border-neutral-800';
  let statusMessage = 'Order Received';
  let StatusIcon = Clock;

  if (isCooking) {
      statusColor = 'text-orange-500';
      statusBg = 'bg-orange-500/10';
      statusBorder = 'border-orange-500/20';
      statusMessage = 'Cooking Now...';
      StatusIcon = ChefHat;
  } else if (isReady) {
      statusColor = 'text-[#C0FF02]';
      statusBg = 'bg-[#C0FF02]/10';
      statusBorder = 'border-[#C0FF02]/20';
      statusMessage = 'READY FOR PICKUP!';
      StatusIcon = Check;
  } else if (isCompleted) {
      statusColor = 'text-white';
      statusBg = 'bg-neutral-900';
      statusBorder = 'border-neutral-800';
      statusMessage = 'Order Completed';
      StatusIcon = Check;
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans p-4">
      <div className="max-w-md mx-auto space-y-6 pt-8">

        {/* Header */}
        <div className="text-center space-y-2">
            <h1 className="text-3xl font-black tracking-tight">CurbOS</h1>
            <p className="text-neutral-500 text-sm">Order Tracking</p>
        </div>

        {/* Status Card */}
        <div className={`rounded-2xl border-2 p-8 text-center transition-all duration-500 ${statusBg} ${statusBorder}`}>
            <div className={`inline-flex p-4 rounded-full mb-6 ${statusColor} bg-black/20`}>
                <StatusIcon size={48} className={isCooking ? "animate-pulse" : ""} />
            </div>

            <h2 className={`text-3xl font-black uppercase mb-2 ${statusColor}`}>
                {statusMessage}
            </h2>

            {isReady && (
                <div className="mt-4 px-4 py-2 bg-[#C0FF02] text-black font-bold rounded-lg animate-bounce">
                    PLEASE COLLECT YOUR ORDER
                </div>
            )}

             <div className="mt-6 pt-6 border-t border-neutral-800/50">
                <p className="text-neutral-400 text-sm uppercase tracking-wider mb-1">Order Number</p>
                <p className="text-5xl font-black text-white">#{order.order_number}</p>
                 {order.customer_name && (
                    <p className="text-lg font-medium text-white mt-2">{order.customer_name}</p>
                )}
            </div>
        </div>

        {/* Order Details */}
        <div className="bg-neutral-900 rounded-xl p-6 border border-neutral-800">
            <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-4">Your Items</h3>
            <div className="space-y-3">
                {items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-start">
                        <div className="flex gap-3">
                            <span className="bg-neutral-800 w-6 h-6 rounded flex items-center justify-center text-xs font-bold text-neutral-300">
                                {item.quantity}
                            </span>
                            <div>
                                <p className="font-medium text-sm">{item.name}</p>
                                {item.modifiers && item.modifiers.length > 0 && (
                                    <p className="text-xs text-neutral-500 mt-1">
                                        {item.modifiers.join(', ')}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        <div className="text-center pt-8">
            <p className="text-neutral-600 text-xs">
                Powered by CurbOS
            </p>
        </div>

      </div>
    </div>
  );
}
