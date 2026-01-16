/**
 * Build update data object for price list update.
 *
 * @param {Object} body - Request body with price list fields
 * @returns {Object} Update data object
 */
export function buildPriceListUpdateData(body: {
  document_name?: string;
  document_url?: string;
  effective_date?: string;
  expiry_date?: string;
  notes?: string;
  is_current?: boolean;
}) {
  const { document_name, document_url, effective_date, expiry_date, notes, is_current } = body;

  const updateData: any = {};
  if (document_name !== undefined) updateData.document_name = document_name;
  if (document_url !== undefined) updateData.document_url = document_url;
  if (effective_date !== undefined) updateData.effective_date = effective_date;
  if (expiry_date !== undefined) updateData.expiry_date = expiry_date;
  if (notes !== undefined) updateData.notes = notes;
  if (is_current !== undefined) updateData.is_current = is_current;

  return updateData;
}
