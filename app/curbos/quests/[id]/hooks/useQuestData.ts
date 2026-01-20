import { logger } from '@/lib/logger';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { Customer, Quest, Transaction } from '../types';

export function useQuestData(id: string) {
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [availableQuests, setAvailableQuests] = useState<Quest[]>([]);
    const [recentOrders, setRecentOrders] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            // PREVIEW MODE: Mock Data for visual verification
            if (id === 'preview') {
                setCustomer({
                    id: 'preview',
                    member_number: 101, // Mock Member Number
                    full_name: 'Daniel Kuschmierz', // Using user name for personalization
                    current_rank: 'Taco Titan',
                    lifetime_miles: 15420,
                    redeemable_miles: 2450,
                    streak_count: 5,
                    stamp_cards: { 'Burritos': 8, 'Coffee': 3 },
                    unlocked_regions: ['Baja', 'Oaxaca'],
                    active_quests: [],
                    avatar_url: undefined // Default to no photo to show upload UI capable state
                });
                setAvailableQuests([
                    { id: '1', title: 'Taco Sampler', description: 'Try 3 different taco varieties.', reward_miles: 500, quest_type: 'BUY_X_ITEMS', target: 3, current_value: 0 },
                    { id: '2', title: 'Lunch Hero', description: 'Visit us 3 times during lunch hours.', reward_miles: 300, quest_type: 'VISIT_FREQUENCY', target: 3, current_value: 0 }
                ]);
                setRecentOrders([
                    { id: '123', order_number: 1042, total_amount: 15.50, fulfillment_status: 'COMPLETED', created_at: new Date().toISOString(), items_json: '[{},{}]' },
                    { id: '124', order_number: 1045, total_amount: 8.00, fulfillment_status: 'READY', created_at: new Date().toISOString(), items_json: '[{}]' }
                ]);
                setLoading(false);
                return;
            }

            try {
                // Fetch Customer
                const customerPromise = supabase
                    .from('customers')
                    .select('*')
                    .eq('id', id)
                    .single();

                // Fetch Available Quests (Global for now)
                const questsPromise = supabase
                    .from('quests')
                    .select('*')
                    .eq('is_active', true)
                    .order('created_at', { ascending: false });

                // Fetch Recent Orders (Limit 5)
                const ordersPromise = supabase
                    .from('transactions')
                    .select('*')
                    .eq('customer_id', id)
                    .order('created_at', { ascending: false })
                    .limit(5);

                const [customerRes, questsRes, ordersRes] = await Promise.all([customerPromise, questsPromise, ordersPromise]);

                if (customerRes.error) {
                    logger.error('Error fetching customer passport', customerRes.error);
                }
                if (customerRes.data) {
                    setCustomer(customerRes.data as Customer);
                }

                if (questsRes.data) {
                    setAvailableQuests(questsRes.data);
                }

                if (ordersRes.data) {
                    setRecentOrders(ordersRes.data);
                } else if (id === 'preview') {
                    // Mock Orders for Preview - Fallback if API fails in preview mode (though dealt with above)
                     setRecentOrders([
                         { id: '123', order_number: 1042, total_amount: 15.50, fulfillment_status: 'COMPLETED', created_at: new Date().toISOString(), items_json: '[{},{}]' },
                         { id: '124', order_number: 1045, total_amount: 8.00, fulfillment_status: 'READY', created_at: new Date().toISOString(), items_json: '[{}]' }
                     ]);
                }

            } catch (e) {
                logger.error('Unexpected error fetching data', e);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [id]);

    return { customer, availableQuests, recentOrders, loading };
}
