export interface Supplier {
  id: number;
  name: string;
  contact_person: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  website: string | null;
  payment_terms: string | null;
  delivery_schedule: string | null;
  minimum_order_amount: number | null;
  is_active: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface SupplierPriceList {
  id: number;
  supplier_id: number;
  document_name: string;
  document_url: string;
  effective_date: string | null;
  expiry_date: string | null;
  is_current: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
  suppliers: Supplier;
}

export interface SupplierFormData {
  id?: string | number;
  name: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  payment_terms: string;
  delivery_schedule: string;
  minimum_order_amount: string;
  notes: string;
}

export interface PriceListFormData {
  id?: string | number;
  supplier_id: string;
  document_name: string;
  document_url: string;
  effective_date: string;
  expiry_date: string;
  notes: string;
  is_current: boolean;
}
