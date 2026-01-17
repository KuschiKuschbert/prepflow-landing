/**
 * Build supplier data object from request body.
 *
 * @param {Object} body - Request body
 * @returns {Object} Supplier data object
 */
export function buildSupplierData(body: unknown) {
  const data = body as Record<string, any>;
  return {
    supplier_name: data.supplier_name,
    contact_person: data.contact_person || null,
    email: data.email || null,
    phone: data.phone || null,
    address: data.address || null,
    website: data.website || null,
    payment_terms: data.payment_terms || null,
    delivery_schedule: data.delivery_schedule || null,
    minimum_order_amount: data.minimum_order_amount ? parseFloat(data.minimum_order_amount) : null,
    notes: data.notes || null,
    is_active: data.is_active !== undefined ? data.is_active : true,
  };
}
