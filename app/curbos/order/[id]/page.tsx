'use client';

import { logger } from '@/lib/logger';
import { supabase } from '@/lib/supabase';
import { Check, ChefHat, Clock, Trophy, Utensils } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

interface OrderItem {
  id?: string;
  name: string;
  quantity: number;
  modifiers?: string[];
}

interface OrderStatus {
  id: string;
  order_number: number | null;
  customer_name: string | null;
  customer_id: string | null; // Added for Passport Link
  fulfillment_status: 'PENDING' | 'IN_PROGRESS' | 'READY' | 'COMPLETED';
  items_json: string | OrderItem[] | null;
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

  // Sound Effect Helper (Web Audio API)
  const playNotificationSound = () => {
    try {
      const AudioContextClass = (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext) as typeof AudioContext;
      if (!AudioContextClass) return;

      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      // Nice "Ding" sound
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(1046.5, ctx.currentTime + 0.1); // C6

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {
      logger.error('Audio play failed', e as Error);
    }
  };

  const prevStatus = useState<string | null>(null);
  const prevStatusRef = useRef<string | null>(null);

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

        // Check for status change to READY
        if (data.fulfillment_status === 'READY' && prevStatusRef.current && prevStatusRef.current !== 'READY') {
             // Play Notification
             playNotificationSound();
             if (typeof navigator !== 'undefined' && navigator.vibrate) {
                 navigator.vibrate([200, 100, 200]);
             }
        }
        prevStatusRef.current = data.fulfillment_status;

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

    // Realtime Subscription
    const channel = supabase
      .channel(`order-${id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'transactions',
          filter: `id=eq.${id}`,
        },
        (payload: { new: OrderStatus }) => {
          const newData = payload.new;

          // Check for status change to READY
          if (newData.fulfillment_status === 'READY' && prevStatusRef.current !== 'READY') {
               // Play Sound
               playNotificationSound();

               // Vibrate
               if (typeof navigator !== 'undefined' && navigator.vibrate) {
                   navigator.vibrate([200, 100, 200]);
               }

               // System Notification
               if (Notification.permission === 'granted') {
                   new Notification('Order Ready!', {
                       body: `Order #${newData.order_number} is ready for pickup!`,
                       icon: '/favicon.ico' // Ensure this path is valid or remove
                   });
               }
          }
          prevStatusRef.current = newData.fulfillment_status;
          setOrder(newData);
        }
      )
      .subscribe();

    // Request Notification Permission on mount
    if (typeof Notification !== 'undefined' && Notification.permission !== 'granted') {
        Notification.requestPermission();
    }

    return () => {
        supabase.removeChannel(channel);
    };
  }, [id, startTime]);

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
      statusColor = 'text-[#ccff00]';
      statusBg = 'bg-[#ccff00]/10';
      statusBorder = 'border-[#ccff00]/20';
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
                <div className="mt-4 px-4 py-2 bg-[#ccff00] text-black font-bold rounded-lg animate-bounce">
                    PLEASE COLLECT YOUR ORDER
                </div>
            )}

             <div className="mt-6 pt-6 border-t border-neutral-800/50">
                <p className="text-neutral-400 text-sm uppercase tracking-wider mb-1">Order Number</p>
                <p className="text-5xl font-black text-white">#{order.order_number}</p>
                 {order.customer_name && (
                    <p className="text-lg font-medium text-white mt-2">{order.customer_name}</p>
                )}

                {order.customer_id && (
                     <a href={`/curbos/quests/${order.customer_id}`} className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-[#ccff00] text-sm font-bold rounded-lg transition-colors">
                         <Trophy size={16} /> View My Passport
                     </a>
                )}
            </div>
        </div>

        {/* Order Details */}
        <div className="bg-neutral-900 rounded-xl p-6 border border-neutral-800">
            <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-4">Your Items</h3>
            <div className="space-y-3">
                {items.map((item: OrderItem, idx: number) => (
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
