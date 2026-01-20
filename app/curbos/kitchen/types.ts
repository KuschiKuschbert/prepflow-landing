export interface OrderModifier {
  name: string;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  modifiers: (string | OrderModifier)[];
}

export interface Transaction {
    id: string
    timestamp: number
    order_number: number | null
    customer_name: string | null
    fulfillment_status: string
    items_json: string | OrderItem[] | null
}
