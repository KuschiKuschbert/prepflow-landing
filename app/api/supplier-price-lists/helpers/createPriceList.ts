import { supabaseAdmin } from '@/lib/supabase';

/**
 * Create a new supplier price list.
 *
 * @param {Object} data - Price list data
 * @returns {Promise<Object>} Created price list with supplier relation
 */
export async function createPriceList(data: {
  supplier_id: number;
  document_name: string;
  document_url: string;
  effective_date?: string | null;
  expiry_date?: string | null;
  is_current: boolean;
  notes?: string | null;
}) {
  const { data: created, error } = await supabaseAdmin!
    .from('supplier_price_lists')
    .insert(data)
    .select(
      `
      *,
      suppliers (
        id,
        name,
        contact_person,
        email,
        phone
      )
    `,
    )
    .single();

  if (error) throw error;
  return created;
}
