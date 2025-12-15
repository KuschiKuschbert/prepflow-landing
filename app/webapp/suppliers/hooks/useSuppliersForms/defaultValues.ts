/**
 * Default form values for suppliers forms.
 */
import type { SupplierFormData, PriceListFormData } from '../../types';

export const DEFAULT_SUPPLIER_FORM: SupplierFormData = {
  name: '',
  contact_person: '',
  email: '',
  phone: '',
  address: '',
  website: '',
  payment_terms: '',
  delivery_schedule: '',
  minimum_order_amount: '',
  notes: '',
};

export const DEFAULT_PRICE_LIST_FORM: PriceListFormData = {
  supplier_id: '',
  document_name: '',
  document_url: '',
  effective_date: '',
  expiry_date: '',
  notes: '',
  is_current: true,
};
