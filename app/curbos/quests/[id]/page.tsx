import { logger } from '@/lib/logger';
import { createClient } from '@supabase/supabase-js';
import { Coffee, Flame, Lock, Star, Trophy } from 'lucide-react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

// Initialize Supabase Client (Public Read)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export const revalidate = 60; // Cache for 60 seconds

interface Customer {
  id: string;
  full_name: string | null;
  current_rank: string;
  lifetime_miles: number;
  redeemable_miles: number;
  streak_count: number;
  stamp_cards: Record<string, number>; // JSON
  active_quests: any[]; // JSON
  unlocked_regions: string[];
}

/**
 * Fetch customer data by ID from Supabase.
 */
async function getCustomer(id: string) {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      logger.error('Error fetching customer for public passport:', error);
      return null;
    }
    return data as Customer;
  } catch (error) {
    logger.error('Unexpected error fetching customer:', error);
    return null;
  }
}

/**
 * Generate Metadata for the Quest Page.
 */
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  return {
    title: 'My CurbOS Passport',
    description: 'Track your quests, stamps, and rewards.',
  };
}

/**
 * Public Quest Page Component.
 * Displays customer stats, quests, and stamps.
 */
export default async function QuestPage({ params }: { params: { id: string } }) {
  const customer = await getCustomer(params.id);

  if (!customer) {
    notFound();
  }

  // Safe Defaults if columns missing
  const streak = customer.streak_count || 0;
  const stamps = customer.stamp_cards || {};
  const quests = customer.active_quests || [];
  const rank = customer.current_rank || 'Street Rookie';
  const miles = Math.floor(customer.redeemable_miles || 0);

  return (
    <div className="min-h-screen bg-black text-white font-sans pb-20">
      {/* Header */}
      <div className="bg-neutral-900 border-b border-white/10 p-6 sticky top-0 z-50 backdrop-blur-md bg-opacity-80">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold tracking-tight">CurbOS <span className="text-[#C0FF02]">Passport</span></h1>
            <p className="text-xs text-neutral-400 font-medium">MEMBER ID: {params.id.slice(0, 8)}...</p>
          </div>
          <div className="h-10 w-10 bg-[#C0FF02] rounded-full flex items-center justify-center text-black font-bold text-lg shadow-[0_0_15px_rgba(192,255,2,0.4)]">
            {customer.full_name ? customer.full_name[0].toUpperCase() : '?'}
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-6 space-y-8">

        {/* Main Stats Card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-800 to-neutral-900 border border-white/10 p-6 shadow-2xl">
           <div className="absolute top-0 right-0 p-4 opacity-10">
             <Trophy size={120} />
           </div>

           <div className="relative z-10">
             <div className="flex justify-between items-start mb-6">
               <div>
                 <p className="text-neutral-400 text-xs font-bold tracking-widest uppercase">Current Rank</p>
                 <h2 className="text-3xl font-black text-white mt-1">{rank}</h2>
               </div>
               {streak > 1 && (
                  <div className="flex flex-col items-center animate-pulse">
                    <Flame size={32} className="text-orange-500 fill-orange-500" />
                    <span className="text-orange-500 font-bold text-xs">{streak} Wk Streak</span>
                  </div>
               )}
             </div>

             <div className="bg-black/30 rounded-xl p-4 flex justify-between items-center border border-white/5">
                <div>
                   <p className="text-xs text-neutral-400 font-medium">Redeemable Miles</p>
                   <p className="text-2xl font-bold text-[#C0FF02]">{miles}</p>
                </div>
                <div className="h-8 w-px bg-white/10"></div>
                 <div>
                   <p className="text-xs text-neutral-400 font-medium">Next Reward</p>
                   <p className="text-sm font-bold text-white">?? Miles</p>
                </div>
             </div>
           </div>
        </div>

        {/* Quests Section */}
        <div>
          <h3 className="text-[#C0FF02] font-bold uppercase tracking-wider text-sm mb-4 flex items-center gap-2">
            <Trophy size={16} /> Active Quests
          </h3>

          {quests.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-neutral-700 rounded-2xl text-neutral-500 text-sm">
              No active quests. Visit the store to unlock new missions!
            </div>
          ) : (
            <div className="space-y-4">
              {quests.map((quest: any, i) => (
                <div key={i} className="bg-neutral-900 border border-white/5 p-4 rounded-xl flex items-center justify-between">
                   <div>
                      <p className="font-bold text-white">Mission #{i+1}</p>
                      <p className="text-xs text-neutral-400 mt-1">Progress: {quest.current_value} / ??</p>
                   </div>
                   <div className="h-2 w-24 bg-neutral-800 rounded-full overflow-hidden">
                      <div className="h-full bg-[#C0FF02]" style={{ width: '40%' }}></div>
                   </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Digital Stamps Section */}
        <div>
          <h3 className="text-[#C0FF02] font-bold uppercase tracking-wider text-sm mb-4 flex items-center gap-2">
            <Star size={16} /> Punch Cards
          </h3>

          <div className="space-y-4">
            {Object.entries(stamps).length === 0 ? (
               <div className="p-8 text-center border border-dashed border-neutral-700 rounded-2xl text-neutral-500 text-sm bg-neutral-900/50">
                  Buy specific items (like Burritos) to earn stamps!
               </div>
            ) : Object.entries(stamps).map(([category, count]) => (
                <div key={category} className="bg-neutral-900 border border-white/5 p-4 rounded-xl">
                   <div className="flex justify-between items-center mb-3">
                      <span className="font-bold text-white">{category} Club</span>
                      <span className="text-xs font-mono text-[#C0FF02] bg-[#C0FF02]/10 px-2 py-1 rounded">Buy 10 Get 1</span>
                   </div>
                   <div className="flex gap-2">
                      {[...Array(10)].map((_, i) => (
                        <div key={i} className={`h-6 w-6 rounded-full flex items-center justify-center border ${i < (count as number) ? 'bg-[#C0FF02] border-[#C0FF02] text-black' : 'bg-transparent border-neutral-700'}`}>
                           {i < (count as number) && <Coffee size={12} strokeWidth={3} />}
                        </div>
                      ))}
                   </div>
                </div>
            ))}
          </div>
        </div>

        {/* Regions */}
        <div>
          <h3 className="text-[#C0FF02] font-bold uppercase tracking-wider text-sm mb-4 flex items-center gap-2">
             <Lock size={16} /> Unlocked Regions
          </h3>
          <div className="grid grid-cols-3 gap-3">
             {['Baja', 'Oaxaca', 'Yucatán', 'Jalisco', "Chef's Vault"].map(region => {
                const unlocked = customer.unlocked_regions?.includes(region);
                return (
                  <div key={region} className={`aspect-square rounded-xl flex flex-col items-center justify-center border ${unlocked ? 'bg-[#C0FF02] border-[#C0FF02]' : 'bg-neutral-900 border-white/5'}`}>
                      {unlocked ? <Trophy className="text-black mb-2" size={20} /> : <Lock className="text-neutral-600 mb-2" size={20} />}
                      <span className={`text-[10px] font-bold uppercase ${unlocked ? 'text-black' : 'text-neutral-600'}`}>{region}</span>
                  </div>
                )
             })}
          </div>
        </div>

      </div>
    </div>
  );
}
