import { logger } from '@/lib/logger';
import { supabase } from '@/lib/supabase-pos';
import { useEffect, useState } from 'react';
import { Transaction } from '../types';

export function useKitchenOrders() {
    const [orders, setOrders] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    async function fetchOrders() {
        const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .neq('fulfillment_status', 'COMPLETED')
            .order('timestamp', { ascending: true });

        if (error) {
            logger.error('Error fetching kitchen orders:', error);
        } else {
            setOrders(data || []);
        }
        setIsLoading(false);
    }

    useEffect(() => {
        fetchOrders();

        const channel = supabase.channel('table-db-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'transactions',
                },
                (payload) => {
                    logger.dev('KDS: Change received!', payload);
                    fetchOrders();
                }
            )
            .subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    logger.dev('KDS: Realtime subscription active!');
                } else if (status === 'CLOSED') {
                    logger.dev('KDS: Realtime subscription closed');
                } else if (status === 'CHANNEL_ERROR') {
                    logger.error('KDS: Realtime subscription error');
                }
            });

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    async function updateStatus(id: string, status: string) {
        try {
            const response = await fetch('/api/kds/update-status', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id, status }),
            });

            if (!response.ok) {
                const data = await response.json();
                logger.error('Error updating status:', data.error || 'Unknown error');
            }
        } catch (e) {
            logger.error('Network error updating status:', e);
        }
    }

    return {
        orders,
        isLoading,
        updateStatus,
        refreshOrders: fetchOrders
    };
}
