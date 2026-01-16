/**
 * Map order list to CSV row format (flattened with items).
 */
import type { OrderList } from '../../printOrderList';

export function mapOrderListToCSVRows(orderList: OrderList): Record<string, unknown>[] {
  if (!orderList.order_list_items || orderList.order_list_items.length === 0) {
    return [
      {
        'Order List Name': orderList.name,
        Supplier: orderList.suppliers.name,
        Status: orderList.status,
        Ingredient: '',
        Category: '',
        Quantity: '',
        Unit: '',
        Notes: orderList.notes || '',
        'Created At': new Date(orderList.created_at).toLocaleDateString('en-AU'),
      },
    ];
  }
  return orderList.order_list_items.map(item => ({
    'Order List Name': orderList.name,
    Supplier: orderList.suppliers.name,
    Status: orderList.status,
    Ingredient: item.ingredients.name,
    Category: item.ingredients.category || '',
    Quantity: item.quantity,
    Unit: item.unit,
    Notes: item.notes || '',
    'Created At': new Date(orderList.created_at).toLocaleDateString('en-AU'),
  }));
}
