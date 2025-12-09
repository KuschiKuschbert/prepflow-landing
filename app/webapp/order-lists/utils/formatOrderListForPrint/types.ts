/**
 * Type definitions for order list formatting
 */

export interface OrderListIngredient {
  id: string;
  ingredient_name: string;
  brand?: string;
  pack_size?: string;
  pack_size_unit?: string;
  pack_price?: number;
  cost_per_unit: number;
  unit?: string;
  storage?: string;
  category?: string;
  par_level?: number;
  reorder_point?: number;
  par_unit?: string;
}

export interface SupplierInfo {
  name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
  payment_terms?: string;
}

export interface OrderListData {
  menuName: string;
  groupedIngredients: Record<string, OrderListIngredient[]>;
  sortBy: string;
  supplier?: SupplierInfo;
  purchaseOrderNumber?: string;
}
