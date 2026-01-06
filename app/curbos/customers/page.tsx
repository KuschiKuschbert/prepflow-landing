import { logger } from '@/lib/logger';
import { createClient } from '@supabase/supabase-js';
import CustomerCard from './CustomerCard';

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
            <CustomerCard key={customer.id} customer={customer} />
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
