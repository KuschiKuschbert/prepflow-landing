import { logger } from '@/lib/logger';
import { createClient } from '@supabase/supabase-js';
import { Flame, MapPin, Trophy } from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export const revalidate = 0; // Dynamic

interface Customer {
  id: string;
  full_name: string | null;
  phone_number: string;
  email: string | null;
  current_rank: string;
  lifetime_miles: number;
  redeemable_miles: number;
  streak_count: number;
  last_visit: number;
  zip_code: string | null;
}

async function getCustomers() {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('full_name', { ascending: true });

    if (error) {
      logger.error('Error fetching customers:', error);
      return [];
    }
    return data as Customer[];
  } catch (error) {
    logger.error('Unexpected error fetching customers:', error);
    return [];
  }
}

export default async function CustomerDirectory() {
  const customers = await getCustomers();

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-[#ccff00]">Customer Database</h1>
          <div className="bg-[#1E1E1E] px-4 py-2 rounded-lg border border-[#ccff00]/20">
            <span className="text-[#ccff00] font-bold">{customers.length}</span> Members
          </div>
        </div>

        <div className="grid grid-cols-1 tablet:grid-cols-3 desktop:grid-cols-4 gap-6">
          {customers.map((customer) => (
            <div
              key={customer.id}
              className="bg-[#1E1E1E] rounded-xl p-6 border border-zinc-800 hover:border-[#ccff00]/50 transition-colors"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    {customer.full_name || 'Unknown Member'}
                  </h3>
                  <div className="text-sm text-zinc-400 font-mono">
                    {customer.phone_number}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-[#ccff00]">
                    {Math.floor(customer.redeemable_miles)}
                  </div>
                  <div className="text-xs text-zinc-500 uppercase tracking-widest">Miles</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-black/50 p-3 rounded-lg flex items-center space-x-3">
                  <Trophy className="w-5 h-5 text-purple-400" />
                  <div>
                    <div className="text-xs text-zinc-500 uppercase">Rank</div>
                    <div className="font-bold text-purple-100 text-sm">{customer.current_rank}</div>
                  </div>
                </div>
                <div className="bg-black/50 p-3 rounded-lg flex items-center space-x-3">
                  <Flame className="w-5 h-5 text-orange-400" />
                  <div>
                    <div className="text-xs text-zinc-500 uppercase">Streak</div>
                    <div className="font-bold text-orange-100 text-sm">{customer.streak_count} Wks</div>
                  </div>
                </div>
              </div>

              {customer.zip_code && (
                <div className="flex items-center text-zinc-500 text-sm mt-4 pt-4 border-t border-zinc-800">
                  <MapPin className="w-4 h-4 mr-2" />
                  ZIP: {customer.zip_code}
                </div>
              )}
            </div>
          ))}
        </div>

        {customers.length === 0 && (
          <div className="text-center py-20 bg-[#1E1E1E]/50 rounded-2xl border border-dashed border-zinc-800">
            <h2 className="text-2xl font-bold text-zinc-500 mb-2">No Customers Found</h2>
            <p className="text-zinc-600">Run "Push to Cloud" from your POS to sync/clone the database.</p>
          </div>
        )}
      </div>
    </div>
  );
}
