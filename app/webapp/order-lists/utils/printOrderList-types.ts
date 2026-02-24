/**
 * Shared types for order list print utilities.
 * Extracted to avoid circular dependencies.
 */

export interface OrderListItem {
  id: string;
  ingredient_id: string;
  quantity: number;
  unit: string;
  notes?: string;
  ingredients: {
    id: string;
    name: string;
    unit: string;
    category: string;
  };
}

export interface OrderList {
  id: string;
  supplier_id: string;
  name: string;
  notes?: string;
  status: 'draft' | 'sent' | 'received' | 'cancelled';
  created_at: string;
  updated_at: string;
  suppliers: {
    id: string;
    name: string;
  };
  order_list_items: OrderListItem[];
}

export interface PrintOrderListOptions {
  orderList: OrderList;
}
