/**
 * Populate customers test data
 */

import { logger } from '@/lib/logger';
import { createSupabaseAdmin } from '@/lib/supabase';
import type { PopulateResults } from './index';

const SAMPLE_CUSTOMERS = [
  {
    first_name: 'Sarah',
    last_name: 'Mitchell',
    email: 'sarah.mitchell@grandhotel.com.au',
    phone: '+61 412 345 678',
    phone_number: '+61 412 345 678',
    company: 'The Grand Hotel',
    notes: 'Prefers formal service style. Regular corporate event client.',
  },
  {
    first_name: 'James',
    last_name: 'Chen',
    email: 'j.chen@harbourview.com.au',
    phone: '+61 433 987 654',
    phone_number: '+61 433 987 654',
    company: 'Harbourview Restaurant Group',
    notes: null,
  },
  {
    first_name: 'Emily',
    last_name: 'Parker',
    email: 'emily.p@gmail.com',
    phone: '+61 421 555 012',
    phone_number: '+61 421 555 012',
    company: null,
    notes: 'Wedding client. Dietary requirements: 3 vegan, 2 gluten-free guests.',
  },
  {
    first_name: 'Marcus',
    last_name: 'Thompson',
    email: 'marcus@techinnovate.io',
    phone: '+61 411 000 001',
    phone_number: '+61 411 000 001',
    company: 'TechInnovate Pty Ltd',
    notes: 'Quarterly conference catering. Always needs AV-compatible room setups.',
  },
  {
    first_name: 'Lisa',
    last_name: 'Nguyen',
    email: 'lisa.nguyen@outlook.com',
    phone: '+61 402 111 333',
    phone_number: '+61 402 111 333',
    company: null,
    notes: null,
  },
  {
    first_name: 'David',
    last_name: "O'Brien",
    email: 'dobrien@coastalresorts.com.au',
    phone: '+61 418 222 444',
    phone_number: '+61 418 222 444',
    company: 'Coastal Resorts & Spa',
    notes: 'Multi-venue client. Handles both restaurant and conference catering.',
  },
];

export async function populateCustomers(
  supabaseAdmin: ReturnType<typeof createSupabaseAdmin>,
  results: PopulateResults,
): Promise<Array<{ id: string; first_name: string; last_name: string }>> {
  try {
    const { data: customers, error } = await supabaseAdmin
      .from('customers')
      .insert(SAMPLE_CUSTOMERS)
      .select('id, first_name, last_name');

    if (error) {
      logger.error('[Populate Customers] Error inserting customers:', {
        error: error.message,
        code: error.code,
      });
      results.errors.push({ table: 'customers', error: error.message });
      return [];
    }

    const count = customers?.length ?? 0;
    results.populated.push({ table: 'customers', count });
    logger.dev(`✅ Populated ${count} customers`);
    return customers ?? [];
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    logger.error('[Populate Customers] Unexpected error:', { error: msg });
    results.errors.push({ table: 'customers', error: msg });
    return [];
  }
}
