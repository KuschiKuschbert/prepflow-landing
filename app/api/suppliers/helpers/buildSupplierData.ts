/**
 * Build supplier data object from request body.
 *
 * @param {Object} body - Request body
 * @returns {Object} Supplier data object
 */
export function buildSupplierData(body: unknown) {
  return {
    supplier_name: body.supplier_name,
    contact_person: body.contact_person || null,
    email: body.email || null,
    phone: body.phone || null,
    address: body.address || null,
    website: body.website || null,
    payment_terms: body.payment_terms || null,
    delivery_schedule: body.delivery_schedule || null,
    minimum_order_amount: body.minimum_order_amount ? parseFloat(body.minimum_order_amount) : null,
    notes: body.notes || null,
    is_active: body.is_active !== undefined ? body.is_active : true,
  };
}
