import { logger } from '@/lib/logger';
import { supabase } from '@/lib/supabase';
import { useEffect, useRef, useState } from 'react';
import { OrderStatus } from '../types';

export function useOrderStatus(id: string | undefined) {
    const [order, setOrder] = useState<OrderStatus | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [startTime] = useState(Date.now());
    const [elapsedMillis, setElapsedMillis] = useState(0);

    const prevStatusRef = useRef<string | null>(null);
    const isReadyRef = useRef(false); // To trigger effect only once per state change

    useEffect(() => {
        // Find elapsed time for sync delay handling
        const interval = setInterval(() => {
             setElapsedMillis(Date.now() - startTime);
        }, 1000);
        return () => clearInterval(interval);
    }, [startTime]);

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
                     isReadyRef.current = true;
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
                         isReadyRef.current = true;
                    }
                    prevStatusRef.current = newData.fulfillment_status;
                    setOrder(newData);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [id]);

    return {
        order,
        loading,
        error,
        elapsedMillis,
        prevStatusRef,
        isReadyRef
    };
}
