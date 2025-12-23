import { supabaseAdmin } from '@/lib/supabase';
import { ApiErrorHandler } from '@/lib/api-error-handler';

/**
 * Update a supplier price list.
 *
 * @param {number} id - Price list ID
 * @param {Object} updateData - Update data
 * @returns {Promise<Object>} Updated price list with supplier relation
 */
export async function updatePriceList(id: number, updateData: any) {
  const { data: updated, error } = await supabaseAdmin!
    .from('supplier_price_lists')
    .update(updateData)
    .eq('id', id)
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

  if (error) throw ApiErrorHandler.fromSupabaseError(error, 500);
  return updated;
}
