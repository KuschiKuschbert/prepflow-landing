'use client';

import { logger } from '@/lib/logger';
import { supabase } from '@/lib/supabase-pos';
import { Bell, ChefHat } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Transaction {
  id: string;
  timestamp: number;
  order_number: number | null;
  customer_name: string | null;
  fulfillment_status: string;
}

export default function CustomerDisplay() {
  const [orders, setOrders] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  async function fetchOrders() {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('id, timestamp, order_number, customer_name, fulfillment_status')
        .neq('fulfillment_status', 'COMPLETED')
        .order('timestamp', { ascending: true });

      if (error) {
        logger.error('Error fetching display orders:', error);
      } else {
        setOrders(data || []);
      }
    } catch (err) {
      logger.error('Error fetching display orders:', err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchOrders();

    const channel = supabase
      .channel('customer-display-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transactions',
        },
        () => {
          fetchOrders();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const preparing = orders.filter(
    o => o.fulfillment_status === 'PENDING' || o.fulfillment_status === 'IN_PROGRESS',
  );
  const ready = orders.filter(o => o.fulfillment_status === 'READY');

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-[#C0FF02]"></div>
      </div>
    );
  }

  return (
    <div className="tablet:flex-row flex min-h-screen flex-col overflow-hidden bg-transparent font-sans text-white">
      {/* LEFT COLUMN: PREPARING */}
      <div className="tablet:w-1/2 tablet:border-b-0 tablet:border-r-2 tablet:p-6 desktop:p-8 flex w-full flex-col border-b-2 border-neutral-800 p-4">
        <h1 className="tablet:text-3xl desktop:text-4xl tablet:mb-8 desktop:mb-12 tablet:gap-3 mb-6 flex items-center justify-center gap-2 text-center text-2xl font-bold tracking-widest text-neutral-400 uppercase">
          <ChefHat size={24} className="tablet:w-8 tablet:h-8" /> Preparing
        </h1>

        <div className="tablet:gap-6 tablet:pr-4 custom-scrollbar flex flex-col gap-4 overflow-y-auto pr-2">
          {preparing.length === 0 ? (
            <div className="tablet:text-xl tablet:mt-20 mt-10 text-center text-lg font-medium text-neutral-700">
              No orders in queue
            </div>
          ) : (
            preparing.map(order => (
              <div
                key={order.id}
                className="tablet:p-6 desktop:p-8 flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-900 p-4"
              >
                <span className="tablet:text-4xl desktop:text-5xl text-4xl font-black text-neutral-500">
                  #{order.order_number}
                </span>
                {order.customer_name && (
                  <span className="tablet:text-2xl desktop:text-3xl text-2xl font-bold text-neutral-300 uppercase">
                    {order.customer_name}
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: READY */}
      <div className="tablet:w-1/2 tablet:p-6 desktop:p-8 flex w-full flex-col bg-[#111]/50 p-4">
        <h1 className="tablet:text-3xl desktop:text-4xl tablet:mb-8 desktop:mb-12 tablet:gap-3 mb-6 flex animate-pulse items-center justify-center gap-2 text-center text-2xl font-black tracking-widest text-[#C0FF02] uppercase">
          Ready to Pickup <Bell size={24} className="tablet:w-8 tablet:h-8 text-[#C0FF02]" />
        </h1>

        <div className="tablet:gap-6 tablet:pr-4 custom-scrollbar flex flex-col gap-4 overflow-y-auto pr-2">
          {ready.length === 0 ? (
            <div className="tablet:text-xl tablet:mt-20 mt-10 text-center text-lg font-medium text-neutral-700">
              No orders ready yet
            </div>
          ) : (
            ready.map(order => (
              <div
                key={order.id}
                className="tablet:p-6 desktop:p-8 desktop:p-10 flex items-center justify-between rounded-xl bg-[#C0FF02] p-4 shadow-[0_0_50px_rgba(192,255,2,0.2)]"
              >
                <span className="tablet:text-5xl desktop:text-6xl text-5xl font-black text-black">
                  #{order.order_number}
                </span>
                {order.customer_name && (
                  <span className="tablet:text-3xl desktop:text-4xl text-3xl font-black text-black uppercase">
                    {order.customer_name}
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
