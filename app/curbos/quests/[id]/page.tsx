'use client';

import { logger } from '@/lib/logger';
import { createClient } from '@supabase/supabase-js';
import { motion } from 'framer-motion';
import { Coffee, Flame, Lock, MapPin, Share2, Star, Trophy } from 'lucide-react';
import { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';

// Initialize Supabase Client (Public Read)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface Customer {
  id: string;
  full_name: string | null;
  current_rank: string;
  lifetime_miles: number;
  redeemable_miles: number;
  streak_count: number;
  stamp_cards: Record<string, number>;
  active_quests: any[];
  unlocked_regions: string[];
}

/**
 * Public Quest Page Component.
 * Displays customer stats, quests, and stamps.
 */
export default function QuestPage({ params }: { params: { id: string } }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data, error } = await supabase
          .from('customers')
          .select('*')
          .eq('id', params.id)
          .single();

        if (error) {
            logger.error('Error fetching customer passport', error);
        }

        if (data) {
           setCustomer(data as Customer);
        }
      } catch (e) {
         logger.error('Unexpected error fetching customer passport', e);
      } finally {
         setLoading(false);
      }
    }
    fetchData();
  }, [params.id]);

  if (loading) {
     return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#C0FF02]"></div>
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

  const streak = customer.streak_count || 0;
  const stamps = customer.stamp_cards || {};
  const quests = customer.active_quests || [];
  const rank = customer.current_rank || 'Street Rookie';
  const miles = Math.floor(customer.redeemable_miles || 0);

  // Animation Variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#C0FF02] selection:text-black">

      {/* Dynamic Background Glow */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#C0FF02]/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[120px]"></div>
      </div>

      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 backdrop-blur-xl bg-black/50 border-b border-white/5 p-4"
      >
        <div className="max-w-md mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-black tracking-tighter">CURB<span className="text-[#C0FF02]">OS</span></h1>
            <p className="text-[10px] text-neutral-400 font-mono tracking-widest uppercase">Passport / {params.id.slice(0, 6)}</p>
          </div>
          <div className="h-10 w-10 bg-neutral-900 border border-white/10 rounded-full flex items-center justify-center text-[#C0FF02] font-bold shadow-[0_0_15px_rgba(192,255,2,0.15)]">
            {customer.full_name ? customer.full_name[0].toUpperCase() : '?'}
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-md mx-auto p-6 space-y-8 relative z-10"
      >

        {/* Hero Stats Card */}
        <motion.div variants={item} className="relative overflow-hidden rounded-3xl bg-neutral-900/80 border border-white/10 p-8 shadow-2xl backdrop-blur-md group">
           {/* Scan for Points QR (Mini) */}
           <div className="absolute top-4 right-4 bg-white p-2 rounded-lg opacity-80 group-hover:opacity-100 transition-opacity cursor-pointer">
              <QRCode value={`https://prepflow.org/curbos/quests/${customer.id}`} size={40} />
           </div>

           <div className="relative z-10 pt-4">
             <div className="mb-8">
               <p className="text-[#C0FF02] text-xs font-bold tracking-[0.2em] uppercase mb-2">Current Status</p>
               <h2 className="text-4xl font-black text-white leading-none">{rank}</h2>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/40 rounded-2xl p-4 border border-white/5">
                   <p className="text-xs text-neutral-400 font-medium mb-1">Miles Balance</p>
                   <p className="text-3xl font-bold text-[#C0FF02] font-mono">{miles.toLocaleString()}</p>
                </div>

                {streak > 0 && (
                   <div className="bg-orange-500/10 rounded-2xl p-4 border border-orange-500/20 flex flex-col justify-center items-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-orange-500/5 animate-pulse"></div>
                      <Flame size={24} className="text-orange-500 mb-1" fill="currentColor" />
                      <p className="text-lg font-bold text-orange-500">{streak} Wk Streak</p>
                   </div>
                )}
             </div>
           </div>
        </motion.div>

        {/* Active Quests */}
        <motion.div variants={item}>
          <h3 className="text-neutral-400 font-bold uppercase tracking-wider text-xs mb-4 flex items-center gap-2">
            <Trophy size={14} className="text-[#C0FF02]" /> Active Missions
          </h3>

          {quests.length === 0 ? (
             <div className="p-6 text-center border border-dashed border-neutral-800 rounded-2xl text-neutral-600 text-sm bg-neutral-900/30">
               No active missions. Visit CurbOS to unlock!
             </div>
          ) : (
            <div className="space-y-3">
              {quests.map((quest: any, i) => (
                <div key={i} className="bg-neutral-900/60 border border-white/5 p-5 rounded-2xl flex items-center justify-between backdrop-blur-sm">
                   <div>
                      <p className="font-bold text-white mb-1">Mission #{i+1}</p>
                      <p className="text-xs text-neutral-400">Progress: {quest.current_value} / {quest.target || '??'}</p>
                   </div>
                   <div className="h-12 w-12 rounded-full border-4 border-neutral-800 flex items-center justify-center relative">
                      <span className="text-[10px] font-bold text-[#C0FF02]">40%</span>
                      <svg className="absolute inset-0 transform -rotate-90 w-full h-full" viewBox="0 0 36 36">
                        <path
                          className="text-neutral-800"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="text-[#C0FF02]"
                          strokeDasharray="40, 100"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                      </svg>
                   </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Punch Cards */}
        <motion.div variants={item}>
          <h3 className="text-neutral-400 font-bold uppercase tracking-wider text-xs mb-4 flex items-center gap-2">
            <Star size={14} className="text-[#C0FF02]" /> Punch Cards
          </h3>

          <div className="space-y-4">
             {Object.entries(stamps).length === 0 ? (
                <div className="p-6 text-center border border-dashed border-neutral-800 rounded-2xl text-neutral-600 text-sm bg-neutral-900/30">
                   Buy items to start earning stamps!
                </div>
             ) : Object.entries(stamps).map(([category, count]) => (
                 <div key={category} className="bg-neutral-900/60 border border-white/5 p-5 rounded-2xl">
                    <div className="flex justify-between items-center mb-4">
                       <span className="font-bold text-white text-lg">{category}</span>
                       <span className="text-[10px] font-bold text-black bg-[#C0FF02] px-2 py-1 rounded-md">FREE ITEM @ 10</span>
                    </div>
                    <div className="flex justify-between gap-1">
                       {[...Array(10)].map((_, i) => (
                         <motion.div
                           key={i}
                           initial={{ scale: 0 }}
                           animate={{ scale: 1 }}
                           transition={{ delay: i * 0.05 }}
                           className={`h-7 w-7 rounded-full flex items-center justify-center border ${i < (count as number) ? 'bg-[#C0FF02] border-[#C0FF02] text-black shadow-[0_0_10px_rgba(192,255,2,0.3)]' : 'bg-neutral-800/50 border-white/5 text-neutral-700'}`}
                         >
                            {i < (count as number) && <Coffee size={14} strokeWidth={3} />}
                         </motion.div>
                       ))}
                    </div>
                 </div>
             ))}
          </div>
        </motion.div>

        {/* Region Unlocks */}
        <motion.div variants={item}>
           <h3 className="text-neutral-400 font-bold uppercase tracking-wider text-xs mb-4 flex items-center gap-2">
            <MapPin size={14} className="text-[#C0FF02]" /> Region Unlocks
          </h3>
          <div className="grid grid-cols-3 gap-3">
             {['Baja', 'Oaxaca', 'Yucatán', 'Jalisco', "Chef's Vault"].map((region, idx) => {
                const unlocked = customer.unlocked_regions?.includes(region);
                return (
                  <div key={region} className={`aspect-square rounded-2xl flex flex-col items-center justify-center border transition-all duration-300 ${unlocked ? 'bg-[#C0FF02] border-[#C0FF02] scale-105 shadow-xl' : 'bg-neutral-900/50 border-white/5 grayscale opacity-60'}`}>
                      {unlocked ? <Trophy className="text-black mb-2 drop-shadow-sm" size={24} /> : <Lock className="text-neutral-500 mb-2" size={24} />}
                      <span className={`text-[10px] font-bold uppercase text-center leading-tight px-1 ${unlocked ? 'text-black' : 'text-neutral-500'}`}>{region}</span>
                  </div>
                )
             })}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div variants={item} className="pt-8 pb-4 text-center">
            <button className="text-neutral-500 text-xs flex items-center justify-center gap-2 mx-auto hover:text-[#C0FF02] transition-colors">
                <Share2 size={12} /> Share my Passport
            </button>
        </motion.div>

      </motion.div>
    </div>
  );
}
