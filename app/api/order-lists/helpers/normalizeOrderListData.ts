import { OrderListRecord } from './types';

/**
 * Normalize order list data with nested ingredient_name.
 *
 * @param {OrderListRecord[]} data - Raw order list data from database
 * @returns {OrderListRecord[]} Normalized order list data
 */
export function normalizeOrderListData(data: OrderListRecord[]) {
  return (data || []).map(ol => ({
    ...ol,
    suppliers: ol.suppliers
      ? { ...ol.suppliers, supplier_name: ol.suppliers.supplier_name || ol.suppliers.name }
      : null,
    order_list_items: (ol.order_list_items || []).map(it => ({
      ...it,
      ingredients: it.ingredients
        ? {
            ...it.ingredients,
            ingredient_name: it.ingredients.ingredient_name || it.ingredients.name,
          }
        : null,
    })),
  }));
}
