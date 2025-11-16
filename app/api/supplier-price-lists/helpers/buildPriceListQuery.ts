import { supabaseAdmin } from '@/lib/supabase';

/**
 * Build query for fetching supplier price lists with optional filters.
 *
 * @param {string | null} supplierId - Optional supplier ID filter
 * @param {string | null} current - Optional current status filter ('true' or 'false')
 * @returns {Object} Supabase query builder
 */
export function buildPriceListQuery(supplierId: string | null, current: string | null) {
  let query = supabaseAdmin!
    .from('supplier_price_lists')
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
    .order('effective_date', { ascending: false });

  if (supplierId) {
    query = query.eq('supplier_id', supplierId);
  }
  if (current !== null) {
    query = query.eq('is_current', current === 'true');
  }

  return query;
}
