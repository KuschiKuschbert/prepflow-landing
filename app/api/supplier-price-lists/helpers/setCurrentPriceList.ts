import { supabaseAdmin } from '@/lib/supabase';

/**
 * Set a price list as current and unset all others for the same supplier.
 *
 * @param {number} supplierId - Supplier ID
 * @param {number | null} excludeId - Optional ID to exclude from update
 * @returns {Promise<void>}
 */
export async function setCurrentPriceList(
  supplierId: number,
  excludeId: number | null = null,
): Promise<void> {
  let query = supabaseAdmin!
    .from('supplier_price_lists')
    .update({ is_current: false })
    .eq('supplier_id', supplierId);

  if (excludeId) {
    query = query.neq('id', excludeId);
  }

  await query;
}
