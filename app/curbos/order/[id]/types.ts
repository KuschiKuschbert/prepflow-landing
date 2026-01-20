export interface OrderItem {
  id?: string;
  name: string;
  quantity: number;
  modifiers?: string[];
}

export interface OrderStatus {
  id: string;
  order_number: number | null;
  customer_name: string | null;
  customer_id: string | null; // Added for Passport Link
  fulfillment_status: 'PENDING' | 'IN_PROGRESS' | 'READY' | 'COMPLETED';
  items_json: string | OrderItem[] | null;
}
