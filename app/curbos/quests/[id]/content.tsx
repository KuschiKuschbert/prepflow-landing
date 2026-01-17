'use client';

import TriangleGridBackground from '@/app/curbos/components/TriangleGridBackground';
import PassportIdPage from '@/app/curbos/components/passport/PassportIdPage';
import PassportStampsPage from '@/app/curbos/components/passport/PassportStampsPage';
import { logger } from '@/lib/logger';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { Share2, Trophy } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Quest {
  id: string;
  title: string;
  description: string;
  reward_miles: number;
  quest_type: string;
  target: number;
  current_value: number;
}

interface Transaction {
  id: string;
  order_number: number;
  total_amount: number;
  fulfillment_status: string;
  created_at: string;
  items_json: string;
}

interface Customer {
  id: string;
  member_number?: number;
  full_name: string | null;
  current_rank: string;
  lifetime_miles: number;
  redeemable_miles: number;
  streak_count: number;
  stamp_cards: Record<string, number>;
  active_quests: Quest[];
  unlocked_regions: string[];
  avatar_url?: string;
}

interface QuestPageContentProps {
  id: string;
}

/**
 * Client-Side Quest Page Implementation.
 * Recursively fetches and displays customer stats.
 */
export default function QuestPageContent({ id }: QuestPageContentProps) {
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
             // Mock Orders for Preview
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

  if (loading) {
     return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#ccff00]"></div>
        </div>
     );
  }

  if (!customer) {
    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8 text-center">
            <Trophy size={48} className="text-neutral-600 mb-4" />
            <h1 className="text-2xl font-bold mb-2">Passport Not Found</h1>
            <p className="text-neutral-400">We couldn't find a member with this ID.</p>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent text-white font-sans selection:bg-[#ccff00] selection:text-black relative pb-20">

      {/* Dynamic Background */}
      <TriangleGridBackground />

      {/* Glow Effects */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#ccff00]/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[120px]"></div>
      </div>

      {/* Header */}
      <div className="sticky top-0 z-50 backdrop-blur-md bg-black/30 border-b border-white/5 p-4 mb-8">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
             <h1 className="text-2xl font-black tracking-tighter">CURB<span className="text-[#ccff00]">OS</span> <span className="text-sm font-normal text-neutral-400 tracking-normal opacity-70">OFFICIAL PASSPORT</span></h1>
             <div className="text-xs font-mono text-[#ccff00] border border-[#ccff00] px-2 py-1 rounded">
                 VALID
             </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 perspective-[2000px]">

        {/* The Booklet (Standard ID-3 Spread: 125mm x 88mm x 2 pages = 2.84 aspect ratio (Wait, ID-3 spread is 2x width))
            ID-3 Page: 88mm wide x 125mm high (Portrait standard).
            Spread: 176mm wide x 125mm high.
            Aspect Ratio: 176/125 = 1.41.
         */}
        <motion.div
            initial={{ rotateX: 20, opacity: 0, y: 50 }}
            animate={{ rotateX: 0, opacity: 1, y: 0 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="flex flex-row shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-2xl overflow-hidden mb-12 transform-gpu w-full max-w-[900px] mx-auto aspect-[1.408/1] bg-[#fdfbf7] relative"
        >
            {/* Left Page (ID - Portrait) */}
            <div className="flex-1 w-1/2 min-w-0 h-full relative z-10">
                <PassportIdPage customer={customer} />
                {/* Inner Shadow for Left Page Fold */}
                <div className="absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-black/10 to-transparent pointer-events-none"></div>
            </div>

            {/* Center Spine Binding Effect */}
            <div className="absolute inset-y-0 left-1/2 w-[2px] -ml-[1px] bg-black/20 z-30"></div>
            <div className="absolute inset-y-0 left-1/2 w-16 -ml-8 z-20 pointer-events-none bg-gradient-to-r from-transparent via-black/10 to-transparent mix-blend-multiply"></div>

            {/* Right Page (Stamps - Portrait) */}
            <div className="flex-1 w-1/2 min-w-0 h-full relative z-0">
                {/* Inner Shadow for Right Page Fold */}
                <div className="absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-black/10 to-transparent pointer-events-none z-10"></div>

                <PassportStampsPage
                    unlockedRegions={customer.unlocked_regions || []}
                    stampCards={customer.stamp_cards || {}}
                />
            </div>
        </motion.div>


        {/* Travel Log (Recent Orders) */}
        <div className="max-w-2xl mx-auto">
            <h3 className="text-[#ccff00] font-bold text-center uppercase tracking-widest mb-6 flex items-center justify-center gap-4">
                <span className="h-px w-10 bg-[#ccff00]/50"></span>
                Travel Log
                <span className="h-px w-10 bg-[#ccff00]/50"></span>
            </h3>

            <div className="bg-neutral-900/80 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden font-mono text-sm">
                <div className="grid grid-cols-[auto_1fr_auto] gap-4 p-4 border-b border-white/10 bg-black/40 text-neutral-500 text-xs font-bold uppercase">
                    <div>Date</div>
                    <div>Description</div>
                    <div className="text-right">Visa Status</div>
                </div>

                {recentOrders.length === 0 ? (
                    <div className="p-8 text-center text-neutral-500 italic">No travel history recorded.</div>
                ) : (
                    recentOrders.map((order) => (
                        <a href={`/curbos/order/${order.id}`} key={order.id} className="grid grid-cols-[auto_1fr_auto] gap-4 p-4 border-b border-white/5 hover:bg-white/5 transition-colors group">
                            <div className="text-neutral-400">{new Date(order.created_at).toLocaleDateString()}</div>
                            <div className="text-white">
                                <span className="font-bold text-[#ccff00] group-hover:underline">ORDER #{order.order_number}</span>
                                <span className="block text-xs text-neutral-500">{JSON.parse(order.items_json).length} Items • ${order.total_amount.toFixed(2)}</span>
                            </div>
                            <div className="text-right">
                                <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                                    order.fulfillment_status === 'COMPLETED' ? 'bg-neutral-800 text-neutral-400' :
                                    order.fulfillment_status === 'READY' ? 'bg-[#ccff00] text-black animate-pulse' :
                                    'bg-orange-500/20 text-orange-500'
                                }`}>
                                    {order.fulfillment_status}
                                </span>
                            </div>
                        </a>
                    ))
                )}

                <div className="p-2 bg-black/20 text-center text-[10px] text-neutral-600">
                    END OF ENTRIES
                </div>
            </div>
        </div>

        {/* Share Footer */}
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="pt-12 pb-4 text-center"
        >
            <button className="text-neutral-500 text-xs flex items-center justify-center gap-2 mx-auto hover:text-[#ccff00] transition-colors">
                <Share2 size={12} /> Share my Passport
            </button>
        </motion.div>

      </div>
    </div>
  );
}
